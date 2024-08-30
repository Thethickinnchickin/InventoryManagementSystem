import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';
import { parse } from 'cookie';
// List of protected routes
const protectedRoutes = ['/admin', '/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("what the fuck")

  // const token = Cookie().get('authToken');
  const cookies = req.headers.get('cookie') || '';
  const parsedCookies = parse(cookies);

  const token = parsedCookies['authToken'];

  if (!token) {
    // If there's no token and the route is protected, redirect to login
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    // Decode the token to get the user data
    const decodedToken = jwt.decode(token) as { role: string };
    console.log(decodedToken)
    // Check if the user has the necessary role
    const userRole = decodedToken?.role;

    if (pathname.startsWith('/reports') || pathname.startsWith('/audit-logs')
      || pathname.startsWith('/admim')  
       && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // You can also add role-based checks here if necessary
  // For example, if your token contains a role and you want to restrict access based on it:
  // const userRole = decodeToken(token)?.role;
  // if (pathname.startsWith('/admin') && userRole !== 'admin') {
  //   return NextResponse.redirect(new URL('/unauthorized', req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/audit-logs/:path*', '/reports/:path*', '/orders/:path*', '/'], // Routes where middleware should apply
};
