import {getAverageGrade,getInstructorWithMostCourses} from "@/app/repos/instructors";
import { NextResponse } from 'next/server';

export async function GET(request) {
    const averageGrade = await getAverageGrade();
    const instructorWithMostCourses = await getInstructorWithMostCourses();
    
    return NextResponse.json({
        averageGrade,
        instructorWithMostCourses
    });
}