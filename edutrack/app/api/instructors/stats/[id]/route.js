import { getInstructorAverageById } from "@/repos/instructors";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    try {
        const avg = await getInstructorAverageById(parseInt(params.id));
        return NextResponse.json({ averageGrade: avg ?? 0 });   
    } catch (error) {
        console.error("Error in /api/instructors/statistics/:id", error);
        return NextResponse.json({ averageGrade: 0 });         
    }
}
