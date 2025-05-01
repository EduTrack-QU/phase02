import prisma from './prisma';


export async function getToatalStudentInCourse(courseId) {
  const totalStudent = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      students: true,
    },
  });
  return totalStudent.students.length;

}

export async function getTopThreeCourses() {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        students: {
          _count: 'desc',
        },
      },
      take: 3,
    });
    
    return courses.map(course => ({
      id: course.id,
      name: course.name,
      studentCount: course._count.students,
    }));
  }

  export async function getCoursesWithMostAndLeastStudents() {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { students: true },
        },
      },
      orderBy: {
        students: { _count: 'desc' },
      }
    });
  
    const formatCourse = (course) => course ? ({
      id: course.id,
      name: course.name,
      studentCount: course._count.students
    }) : null;
  
    return {
      mostStudents: formatCourse(courses[0]),
      leastStudents: formatCourse(courses[courses.length - 1]),
    };
  }
  
  export async function getMostFailedCourse() {
    const courses = await prisma.course.findMany({
      where: {
        grade: 'F'
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        students: {
          _count: 'desc',
        },
      },
      take: 1,
    });
    
    if (courses.length === 0) {
      return null;
    }
    
    return {
      id: courses[0].id,
      name: courses[0].name,
      studentCount: courses[0]._count.students,
    };
  }