import {getAverageGpa,getHighestGpa,getLowGPAStudents,getDeansList} from '@/repos/students.js'; 

export async function GET(request) {
    const averageGpa = await getAverageGpa();
    const highestGpa = await getHighestGpa();
    const lowGPAStudents = await getLowGPAStudents();
    const deansList = await getDeansList();

    return new Response(JSON.stringify({ averageGpa, highestGpa, lowGPAStudents,deansList }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}