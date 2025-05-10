import { getGradeDistributionForCourse } from '@/repos/courses';
import { NextResponse } from 'next/server';

export async function GET(_, { params }) {
    const distribution = await getGradeDistributionForCourse(params.courseCode);
    if (!distribution) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    return NextResponse.json(distribution);
}
