import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const instructors = await prisma.instructor.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: { name: "asc" }
    });

    return NextResponse.json(instructors);
}