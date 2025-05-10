import { getFailureRateForCourse } from '@/repos/courses';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
    const rate = await getFailureRateForCourse(parseInt(params.courseCode));
    if (rate === null) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    return NextResponse.json({ failureRate: rate });
}
