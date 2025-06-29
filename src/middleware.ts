import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { User } from '@/shared/lib/types';

// The predefined superuser for the backdoor.
const superuser: User = {
    name: 'Superuser',
    email: 'admin@example.com',
    role: 'Администратор',
    avatar: 'https://placehold.co/100x100.png',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Development-only backdoor to log in as a superuser.
  // Access it via /dashboard?as=superuser
  if (process.env.NODE_ENV === 'development' && request.nextUrl.searchParams.get('as') === 'superuser') {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    };
    response.cookies.set('session', JSON.stringify(superuser), cookieOptions);
    return response;
  }

  const session = request.cookies.get('session');
  
  // Define public paths that don't require authentication.
  const publicPaths = ['/auth', '/'];

  const isPublicPath = publicPaths.includes(pathname);

  // If the user has a session, redirect from public paths to the dashboard.
  if (session) {
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 
  // If the user does not have a session and is trying to access a protected path, redirect to auth.
  else if (!isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
