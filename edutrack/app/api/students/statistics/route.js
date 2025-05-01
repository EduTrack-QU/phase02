import {getAverageGpa,getHighestGpa,getLowGPAStudents} from '@/repos/students.js'; 

export async function GET(request) {
    const averageGpa = await getAverageGpa();
    const highestGpa = await getHighestGpa();
    const lowGPAStudents = await getLowGPAStudents();

    return new Response(JSON.stringify({ averageGpa, highestGpa, lowGPAStudents }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}