import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/gym-staff': ['GYM_STAFF'],
  '/dashboard/pt': ['PT_USER'],
  '/dashboard': ['CLIENT_USER', 'PT_USER', 'GYM_STAFF', 'ADMIN'],
  '/profile': ['CLIENT_USER', 'PT_USER', 'GYM_STAFF', 'ADMIN'],
  '/offers/create': ['PT_USER', 'GYM_STAFF'],
  '/gyms/create': ['GYM_STAFF'],
  '/trainers/create': ['PT_USER'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/gyms',
  '/trainers',
  '/offers',
  '/search',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow all Next.js internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if it's an API route
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For protected routes, check token exists (we'll validate role on client-side)
  const token = request.cookies.get('auth_token')?.value;

  // If no token, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }

  // If token exists, allow access (role-based routing handled by client-side)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
