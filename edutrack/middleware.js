import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/statistics', '/profile'];
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtectedPath && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/statistics/:path*', '/profile/:path*'],
};