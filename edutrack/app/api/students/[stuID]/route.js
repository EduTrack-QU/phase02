import {getStudentById} from '@/repos/students.js'; 

export async function GET(request, {params}) {
    const {stuID} = params;
    const student = await getStudentById(parseInt(stuID));    
    return new Response(JSON.stringify(student), {
        status: 200
    });
}