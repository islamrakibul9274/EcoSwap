import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // Protect /dashboard and /admin routes
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute || isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);
    
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token'); // clear invalid token
      return response;
    }

    // Role-Based Access Control for Admin routes
    if (isAdminRoute && payload.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Prevent logged-in users from accessing /login and /register
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        if (payload.role?.toUpperCase() === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
