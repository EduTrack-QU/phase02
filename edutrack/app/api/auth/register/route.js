import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request) {
    try {
        const { name, email, password, role } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Register the user
        const result = await registerUser({ name, email, password, role });

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, user: result.user },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
} 