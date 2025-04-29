import prisma from './prisma';


export async function getAverageGpa(){
    const aggregations = await prisma.student.aggregate({
        _avg: {
            gpa: true,
        },
    });
    return aggregations._avg.gpa;
}
