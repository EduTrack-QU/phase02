import prisma from './prisma';


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