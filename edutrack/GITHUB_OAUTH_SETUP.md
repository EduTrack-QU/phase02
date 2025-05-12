# Setting Up GitHub OAuth for EduTrack

## 1. Create a GitHub OAuth Application

1. Go to your GitHub account settings
2. Navigate to **Developer settings** > **OAuth Apps** > **New OAuth App**
3. Fill in the application details:
   - **Application name**: `EduTrack` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (must match exactly)
4. Click **Register application**
5. After creating the application, you'll be shown your **Client ID**
6. Generate a new **Client Secret** by clicking the button

## 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (if not already there):

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-custom-secret-key-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Replace `your-github-client-id` and `your-github-client-secret` with the values from your GitHub OAuth application.

## 3. Restart Your Development Server

After setting up the environment variables, make sure to restart your Next.js development server:

```bash
npm run dev
```

## 4. Testing GitHub OAuth

1. Visit `http://localhost:3000/login`
2. Click the "GitHub" button
3. You should be redirected to GitHub's authorization page
4. After authorizing, you'll be redirected back to your application with admin access

## Troubleshooting

- **Not redirecting to GitHub**: Make sure your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correctly set in `.env.local`
- **Callback errors**: Verify your callback URL in GitHub exactly matches `http://localhost:3000/api/auth/callback/github`
- **Scopes**: The default scope is `read:user` and `user:email`, which should be sufficient
- **Email visibility**: Make sure your email is public in GitHub settings or the app has permission to access it 