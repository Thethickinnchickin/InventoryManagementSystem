import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

// List of routes that require authentication
const protectedRoutes = ['/admin', '/user', '/user/cart', '/user/checkout'];

export function middleware(req: NextRequest) {
  // Extract the pathname from the request URL
  const { pathname } = req.nextUrl;
  
  // Retrieve cookies from the request headers
  const cookies = req.headers.get('cookie') || '';
  
  // Parse the cookies to extract the authToken
  const parsedCookies = parse(cookies);
  const token = parsedCookies['authToken'];

  // If no token is present and the route is protected, redirect to the login page
  if (!token) {
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next(); // Allow access to non-protected routes
  }

  try {
    // Validate the token using a secret and decode it to get user information
    const secret = process.env.JWT_SECRET as string; // Ensure you have the JWT_SECRET in your environment
    const decodedToken = jwt.verify(token, secret) as { role: string };
    const userRole = decodedToken?.role;

    // Role-based access control
    // Redirect to unauthorized page if the user does not have the required role
    if ((pathname.startsWith('/admin/reports') || pathname.startsWith('/audit-logs') 
      || pathname.startsWith('/admin')) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    } else if (pathname.startsWith('/user') && userRole !== 'user') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } catch (error) {
    // If token validation fails, redirect to the login page
    console.error('Error decoding token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow the request to proceed if all checks pass
  return NextResponse.next();
}

// Configure middleware to apply to specific routes
export const config = {
  matcher: ['/audit-logs/:path*', '/reports/:path*', '/orders/:path*', '/admin/:path*', '/user/:path*'], // Define the route patterns for the middleware
};
