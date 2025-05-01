import prisma from './prisma';

export async function getAllStudent() {
    const students = await prisma.student.findMany({
        orderBy: {
            gpa: 'desc',
        },
    });
    return students;    
}

export async function getAverageGpa(){
    const aggregations = await prisma.student.aggregate({
        _avg: {
            gpa: true,
        },
    });
    return aggregations._avg.gpa;
}

export async function getHighestGpa() {
    const aggregations = await prisma.student.aggregate({
        _max: {
            gpa: true,
        },
    });
    return aggregations._max.gpa;
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