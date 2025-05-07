import {getAllInstructors} from '@/app/repos/instructors';  

export async function GET(request) {
    const instructors = await getAllInstructors();
    return new Response(JSON.stringify(instructors), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}