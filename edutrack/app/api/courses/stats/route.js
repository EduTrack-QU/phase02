import { getCoursesWithMostAndLeastStudents, getMostFailedCourse } from "@/repos/courses";
import { NextResponse } from "next/server";

export async function GET() {
  const mostLeast = await getCoursesWithMostAndLeastStudents();
  const failed = await getMostFailedCourse();
  return NextResponse.json({
    coursesWithMostAndLeastStudents: mostLeast,
    mostFailedCourse: failed
  });
}
