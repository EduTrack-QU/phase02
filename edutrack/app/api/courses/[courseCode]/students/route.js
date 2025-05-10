import { getTotalStudentsInCourse } from "@/repos/courses";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const count = await getTotalStudentsInCourse(parseInt(params.courseCode));
  return NextResponse.json({ totalStudents: count ?? 0 });
}
