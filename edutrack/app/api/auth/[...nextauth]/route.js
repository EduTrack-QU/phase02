import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            // GitHub OAuth will not provide a password, so we only handle profile data
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: "USER", // Default role, will be updated in callbacks
                };
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log('Attempting login with:', credentials?.email);

                    if (!credentials?.email || !credentials?.password) {
                        console.log('Missing email or password');
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        console.log('No user found with email:', credentials.email);
                        return null;
                    }

                    if (!user.password) {
                        console.log('User exists but has no password (likely GitHub user)');
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log('Password invalid for user:', credentials.email);
                        return null;
                    }

                    console.log('Authentication successful for:', credentials.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.image,
                    };
                } catch (error) {
                    console.error('Error in authorize function:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.role = user.role;

                // If this is a new GitHub login, we need to either link to an existing account
                // or create a new user with the default role
                if (account?.provider === 'github') {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });

                    // If user exists but logged in via GitHub for the first time
                    if (existingUser && !existingUser.role) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { role: 'USER' },
                        });
                        token.role = 'USER';
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
