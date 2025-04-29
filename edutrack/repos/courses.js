import prisma from './prisma';


export async function getToatalStudentPerCourse(courseId) {
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