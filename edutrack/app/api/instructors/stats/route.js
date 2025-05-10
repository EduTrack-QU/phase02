import {getAverageGrade,getInstructorWithMostCourses} from "@/repos/instructors";
import { NextResponse } from 'next/server';

export async function GET(request) {
    const averageGrade = await getAverageGrade();
    const instructorWithMostCourses = await getInstructorWithMostCourses();
    return NextResponse.json({
        averageGrade,
        instructorWithMostCourses
    });
}