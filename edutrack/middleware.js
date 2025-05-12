import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Protected routes requiring authentication
  const authProtectedPaths = ['/profile'];
  const isAuthProtectedPath = authProtectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Admin-only routes
  const adminOnlyPaths = [ '/statistics'];
  const isAdminOnlyPath = adminOnlyPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if trying to access protected route without authentication
  if ((isAuthProtectedPath || isAdminOnlyPath) && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check for admin role on admin-only routes
  if (isAdminOnlyPath && isAuthenticated && token.role !== 'ADMIN') {
    // Redirect non-admin users to an unauthorized page
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ '/statistics/:path*', '/profile/:path*'],
};