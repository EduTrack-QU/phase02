import { getAllCourses,addCourse } from "@/repos/courses";
import { NextResponse } from "next/server";

export async function GET() {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
}
export async function POST(request) {
    const course = await request.json();
    const newCourse = await addCourse(course);
    return new Response(JSON.stringify(newCourse), {
        status: 201,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
