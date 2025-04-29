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