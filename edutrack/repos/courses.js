import prisma from './prisma';

export async function getTotalStudentsInCourse(courseId) {
    const sections = await prisma.section.findMany({
        where: { courseId },
        include: { enrollments: true }
    });

    let totalStudents = 0;
    for (const section of sections) {
        totalStudents += section.enrollments.length;
    }

    return totalStudents;
}

export async function getTopThreeCourses() {
    const courses = await prisma.course.findMany({
        include: {
            sections: {
                include: { enrollments: true }
            }
        }
    });

    const sorted = courses.map(c => ({
        id: c.id,
        name: c.name,
        courseCode: c.courseCode,
        studentCount: c.sections.reduce((acc, sec) => acc + sec.enrollments.length, 0)
    })).sort((a, b) => b.studentCount - a.studentCount);

    return sorted.slice(0, 3);
}

export async function getCoursesWithMostAndLeastStudents() {
    const courses = await prisma.course.findMany({
        include: {
            sections: {
                include: { enrollments: true }
            }
        }
    });

    const mapped = courses.map(c => ({
        id: c.id,
        courseCode: c.courseCode,
        studentCount: c.sections.reduce((acc, sec) => acc + sec.enrollments.length, 0)
    }));

    if (mapped.length === 0) return { mostStudents: null, leastStudents: [] };

    const sorted = [...mapped].sort((a, b) => b.studentCount - a.studentCount);

    const max = sorted[0];
    const minCount = sorted[sorted.length - 1].studentCount;
    const leastCourses = mapped.filter(c => c.studentCount === minCount);

    return {
        mostStudents: max,
        leastStudents: leastCourses
    };
}

export async function getMostFailedCourse() {
    // Get all enrollments
    const failedEnrollments = await prisma.enrollment.findMany({
        where: {
            grade: {
                not: null
            }
        },
        select: {
            grade: true,
            section: {
                select: {
                    courseId: true,
                    course: { select: { id: true, courseCode: true } }
                }
            }
        }
    });

    // Filter F grades manually because Prisma 6.7.0 cannot do case-insensitive
    const fEnrollments = failedEnrollments.filter(e =>
        e.grade.trim().toUpperCase() === 'F'
    );

    if (fEnrollments.length === 0) return null;

    // Aggregate
    const failureCounts = {};
    for (const enrollment of fEnrollments) {
        const courseId = enrollment.section.courseId;
        if (!failureCounts[courseId]) {
            failureCounts[courseId] = {
                id: enrollment.section.course.id,
                courseCode: enrollment.section.course.courseCode,
                failedCount: 0
            };
        }
        failureCounts[courseId].failedCount++;
    }

    const mostFailed = Object.values(failureCounts).sort((a, b) => b.failedCount - a.failedCount)[0];
    return mostFailed;
}


export async function getAllCourses() {
    return prisma.course.findMany({
        select: { id: true, name: true, courseCode: true }
    });
}
export async function getPeakHour() {
    const sections = await prisma.section.findMany({
        select: { schedule: true }
    });

    const hourCounts = {};

    for (const section of sections) {
        const match = section.schedule.match(/(\d{1,2}):\d{2}/);
        if (match) {
            const hour = parseInt(match[1]);
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    }

    let peakHour = null;
    let maxCount = 0;
    for (const [hour, count] of Object.entries(hourCounts)) {
        if (count > maxCount) {
            peakHour = hour;
            maxCount = count;
        }
    }

    return peakHour ? `${peakHour}:00` : "Unknown";
}
export async function getGradeDistributionForCourse(courseCode) {
    const course = await prisma.course.findUnique({
        where: { id:parseInt(courseCode) }
    });

    if (!course) return null;

    const sections = await prisma.section.findMany({
        where: { courseId: course.id },
        include: { enrollments: { select: { grade: true } } }
    });

    const distribution = {
        A: 0, 'A-': 0,
        'B+': 0, B: 0, 'B-': 0,
        'C+': 0, C: 0, 'C-': 0,
        'D+': 0, D: 0, F: 0
    };

    for (const section of sections) {
        for (const enrollment of section.enrollments) {
            if (enrollment.grade && distribution.hasOwnProperty(enrollment.grade.toUpperCase())) {
                distribution[enrollment.grade.toUpperCase()]++;
            }
        }
    }

    return distribution;
}
export async function getFailureRateForCourse(courseCode) {
    const course = await prisma.course.findUnique({
        where: { courseCode }
    });

    if (!course) return null;

    const sections = await prisma.section.findMany({
        where: { courseId: course.id },
        include: { enrollments: { select: { grade: true } } }
    });

    let totalGraded = 0;
    let failedCount = 0;

    for (const section of sections) {
        for (const enrollment of section.enrollments) {
            if (enrollment.grade) {
                totalGraded++;
                if (enrollment.grade.trim().toUpperCase() === 'F') {
                    failedCount++;
                }
            }
        }
    }

    const failureRate = totalGraded === 0 ? 0 : (failedCount / totalGraded) * 100;
    return failureRate.toFixed(2);
}



