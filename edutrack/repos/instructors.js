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
    const instructors = getAllInstructors();

    
}