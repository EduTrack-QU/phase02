import { getTotalStudentsInCourse } from "@/repos/courses";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    const params = await context.params;
    const count = await getTotalStudentsInCourse(parseInt(params.courseCode));
    return NextResponse.json({ totalStudents: count ?? 0 });
}
