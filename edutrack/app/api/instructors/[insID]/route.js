import {getInstructorById} from "@/repos/instructors";

export async function GET(request, {params}) {
    const {inID} = params;
    const instructor = await getInstructorById(parseInt(inID));
    if (!instructor) {
        return new Response('Instructor not found', {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    return new Response(JSON.stringify(instructor), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}