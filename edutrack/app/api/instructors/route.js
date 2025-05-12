import {getAllInstructors,addInstructor} from '@/repos/instructors';  

export async function GET(request) {
    const instructors = await getAllInstructors();
    return new Response(JSON.stringify(instructors), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
export async function POST(request) {
    const instructor = await request.json();
    const newInstructor = await addInstructor(instructor);
    return new Response(JSON.stringify(newInstructor), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}