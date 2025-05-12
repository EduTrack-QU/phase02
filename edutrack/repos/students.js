import prisma from './prisma';

export async function getAllStudent() {
    const students = await prisma.student.findMany({
        orderBy: {
            gpa: 'desc',
        },
    });
    return students;    
}
//get student by id
export async function getStudentById(id) {
    const student = await prisma.student.findUnique({
        where: {
            id: id,
        },
    });
    return student;
}

export async function getAverageGpa(){
    const aggregations = await prisma.student.aggregate({
        _avg: {
            gpa: true,
        },
    });
    return aggregations._avg.gpa.toFixed(2);
}

export async function getHighestGpa() {
    const aggregations = await prisma.student.aggregate({
        _max: {
            gpa: true,
        },
    });
    return aggregations._max.gpa.toFixed(2);
}

export async function getLowGPAStudents(){
    const students = await prisma.student.findMany({
        where: {
            gpa: {
                lte: 2.5,
            },
        },
    });
    return students;
}

export async function getDeansList(){
    const students = await prisma.student.findMany({
        where: {
            gpa: {
                gte: 3.5,
            },
        },
    });
    return students;
}
export async function addStudent(student) {
    const newStudent = await prisma.student.create({
        data: student,
    });
    return newStudent;
}