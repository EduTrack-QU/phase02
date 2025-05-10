import {  getCoursesWithMostAndLeastStudents, getMostFailedCourse, getPeakHour } from '@/repos/courses';
import { NextResponse } from 'next/server';
export async function GET() {
    try {
        const coursesWithMostAndLeastStudents = await getCoursesWithMostAndLeastStudents();
        const mostFailedCourse = await getMostFailedCourse();
        const peakHour = await getPeakHour();

        return NextResponse.json({
            coursesWithMostAndLeastStudents,
            mostFailedCourse,
            peakHour
        });
    } catch (error) {
        console.error("Error in /api/courses/stats", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
