import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === '/auth' || pathname === '/';
  const isWelcomePath = pathname === '/welcome';

  // If the user has a session...
  if (session) {
    // and is trying to access a public path (like login or the landing page), redirect them to the dashboard.
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If the user does not have a session and is trying to access a protected path...
    if (!isPublicPath) {
      // unless it's the welcome page, which we allow for the redirection from register
      if (isWelcomePath && !session) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }
      // redirect them to the login page.
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
