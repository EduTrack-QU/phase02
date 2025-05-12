# EduTrack Authentication System

This project uses Next.js with NextAuth.js for authentication, supporting both email/password and GitHub authentication.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Setting Up GitHub OAuth

**IMPORTANT: All GitHub users are now automatically granted ADMIN privileges.**

1. Go to GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
2. Register a new application
   - Application name: EduTrack (or your preferred name)
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
3. Copy the Client ID and Client Secret to your `.env.local` file

For detailed setup instructions, see [GITHUB_OAUTH_SETUP.md](./GITHUB_OAUTH_SETUP.md)

### GitHub Token Revocation

When a user logs out, their GitHub OAuth token is automatically revoked and their account link is removed from the database. This ensures that when they click the GitHub login button again, they will be redirected to GitHub's login page to re-authenticate.

## Creating an Admin User

To get admin access to the dashboard, you need to register a user with the ADMIN role:

```bash
# Using curl
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"your-secure-password","role":"ADMIN"}'
```

Or create an admin user using the Prisma CLI:

```bash
npx prisma studio
```

Then create a user with the `role` field set to "ADMIN".

## Features

- Email/Password authentication
- GitHub OAuth integration
- Role-based access control
- Admin-only dashboard
- Unified login for all user types
- Password hashing with bcrypt
- JWT-based sessions
- Responsive UI

## Getting Started

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
``` 