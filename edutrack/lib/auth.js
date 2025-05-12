import bcrypt from 'bcrypt';
import prisma from './prisma.js';

//this is used to register users with encrypted password 
export async function registerUser({ name, email, password, role = 'USER' }) {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, message: 'User already exists with this email' };
        }

        // Hash the password with 10 rounds of salting
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Creating user with email: ${email}, role: ${role}`);

        // Create user with appropriate role
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        console.log(`User created with ID: ${user.id}`);

        // Create the appropriate role-specific record if needed
        if (role === 'ADMIN') {
            await prisma.admin.create({
                data: {
                    name: name || 'Admin',
                    userId: user.id,
                    permissions: 'ALL',
                },
            });
            console.log(`Admin record created for user ID: ${user.id}`);
        } else if (role === 'INSTRUCTOR') {
            await prisma.instructor.create({
                data: {
                    name: name || 'Instructor',
                    userId: user.id,
                },
            });
            console.log(`Instructor record created for user ID: ${user.id}`);
        } else if (role === 'STUDENT') {
            await prisma.student.create({
                data: {
                    name: name || 'Student',
                    gpa: 0.0, // Default GPA
                    userId: user.id,
                },
            });
            console.log(`Student record created for user ID: ${user.id}`);
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'An error occurred during registration' };
    }
} 