import { getCourseById } from "@/repos/courses";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
    return NextResponse.json(await getCourseById(parseInt(params.courseCode)));
}