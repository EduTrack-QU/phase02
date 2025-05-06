import prisma from './prisma';


export async function getAllInstructors() {
    const instructors = await prisma.instructor.findMany({
        orderBy: {
            name: 'desc',
        },
    });
    return instructors;    
}

export async function getAverageGrade(){
    const instructors = await getAllInstructors();
    
    const instructorsWithAvgGrades = [];
    
    for (const instructor of instructors) {
        const sections = await prisma.section.findMany({
            where: {
                instructorId: instructor.id
            },
            include: {
                enrollments: true,
                course: true
            }
        });
        
        let totalGradePoints = 0;
        let totalEnrollments = 0;
        
        for (const section of sections) {
            for (const enrollment of section.enrollments) {
                if (enrollment.grade) {
                    // Convert letter grade to grade points
                    const gradePoint = convertGradeToPoints(enrollment.grade);
                    if (gradePoint !== null) {
                        totalGradePoints += gradePoint;
                        totalEnrollments++;
                    }
                }
            }
        }
        
        const averageGrade = totalEnrollments > 0 
            ? (totalGradePoints / totalEnrollments).toFixed(2) 
            : 'N/A';
        
        instructorsWithAvgGrades.push({
            ...instructor,
            averageGrade,
            totalEnrollments
        });
    }
    
    return instructorsWithAvgGrades;
}

// Helper function to convert letter grades to grade points
function convertGradeToPoints(grade) {
    const gradeMap = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'F': 0.0
    };
    
    return gradeMap[grade] !== undefined ? gradeMap[grade] : null;
}

export async function getInstructorWithMostCourses() {
    const instructorsWithSectionCount = await prisma.instructor.findMany({
        include: {
            _count: {
                select: {
                    sections: true
                }
            },
            sections: {
                include: {
                    course: true
                }
            }
        }
    });

    // If no instructors found, return early
    if (instructorsWithSectionCount.length === 0) {
        return null;
    }

    const instructorsWithCoursesCount = instructorsWithSectionCount.map(instructor => {
        const uniqueCourseIds = new Set();
        
        instructor.sections.forEach(section => {
            uniqueCourseIds.add(section.course.id);
        });
        
        return {
            id: instructor.id,
            name: instructor.name,
            speciality: instructor.speciality,
            totalSections: instructor._count.sections,
            uniqueCoursesCount: uniqueCourseIds.size,
            uniqueCourses: Array.from(uniqueCourseIds).length > 0 ? 
                instructor.sections
                    .filter((section, index, self) => 
                        index === self.findIndex(s => s.course.id === section.course.id))
                    .map(section => ({
                        id: section.course.id,
                        name: section.course.name,
                        courseCode: section.course.courseCode
                    })) : []
        };
    });
    instructorsWithCoursesCount.sort((a, b) => b.uniqueCoursesCount - a.uniqueCoursesCount);

    return instructorsWithCoursesCount[0];
}