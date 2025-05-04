import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from '@/repos/prisma'; // Import the shared prisma client

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
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            student: true,
            instructor: true,
            admin: true
          }
        });

        if (!user) {
          return null;
        }

        // Basic password check - for a simple project
        if (user.password !== credentials.password) {
          return null;
        }
        
        // Determine role based on related profiles
        let role = "USER";
        if (user.admin) role = "ADMIN";
        else if (user.instructor) role = "INSTRUCTOR";
        else if (user.student) role = "STUDENT";
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: role
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Add role to the token when user signs in
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Send role to the client
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.sub; // Use the JWT subject (user id)
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };