import {getAllStudent} from '@/repos/students.js'; 

export async function GET(request) {
    const students = await getAllStudent();

    return new Response(JSON.stringify(students), {
        status: 200
    });
}