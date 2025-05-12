import {getAllStudent,addStudent} from '@/repos/students.js'; 

export async function GET(request) {
    const students = await getAllStudent();

    return new Response(JSON.stringify(students), {
        status: 200
    });
}
export async function POST(request) {
    const student = await request.json();
    const newStudent = await addStudent(student);
    return new Response(JSON.stringify(newStudent), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}