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
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: "USER",
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
        async signIn({ user, account, profile }) {
            // Only proceed with GitHub sign-ins
            if (account.provider === 'github') {
                try {
                    const email = profile.email;

                    // Check if this GitHub email already exists in our database
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (existingUser) {
                        // Update the existing user with GitHub details if they don't have them
                        if (!existingUser.image || !existingUser.name) {
                            await prisma.user.update({
                                where: { id: existingUser.id },
                                data: {
                                    name: existingUser.name || profile.name || profile.login,
                                    image: existingUser.image || profile.avatar_url,
                                    role: existingUser.role || 'USER'
                                }
                            });
                        }
                        // Link accounts if not already linked
                        const linkedAccount = await prisma.account.findFirst({
                            where: {
                                userId: existingUser.id,
                                provider: 'github'
                            }
                        });

                        if (!linkedAccount) {
                            await prisma.account.create({
                                data: {
                                    userId: existingUser.id,
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    access_token: account.access_token,
                                    expires_at: account.expires_at,
                                    token_type: account.token_type,
                                    scope: account.scope,
                                    refresh_token: account.refresh_token
                                }
                            });
                        }
                    }
                    // If no existing user, the adapter will create one
                } catch (error) {
                    console.error('Error in GitHub signIn callback:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = user.role || 'USER';
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id || token.sub;
                session.user.role = token.role || 'USER';
            }
            return session;
        },
    },
    events: {
        async createUser({ user }) {
            // Make sure new users created through GitHub have the USER role
            if (!user.role) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'USER' }
                });
            }
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
