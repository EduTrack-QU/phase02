// app/api/courses/list/route.js
import { getAllCourses } from "@/repos/courses";
import { NextResponse } from "next/server";

export async function GET() {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
}
