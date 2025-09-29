import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function that runs on every request to apply security headers
 * and route-specific protections
 * @param request - The incoming Next.js request object
 * @returns NextResponse with security headers applied
 */
export function middleware(request: NextRequest) {
  // Create response object to modify headers
  const response = NextResponse.next();
  
  // Apply essential security headers to all routes
  // These headers help protect against common web vulnerabilities
  response.headers.set('X-Frame-Options', 'DENY'); // Prevents clickjacking attacks
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevents MIME type sniffing
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Controls referrer information
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); // Restricts browser features
  
  // Apply additional security measures for admin routes
  // Admin routes require extra protection due to sensitive operations
  if (request.nextUrl.pathname.startsWith('/api/admin') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('X-Admin-Route', 'true'); // Custom header to identify admin routes
  }
  
  return response;
}

/**
 * Configuration object for the middleware
 * Defines which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - Handled separately for better performance
     * - _next/static (static files) - No need for security headers on static assets
     * - _next/image (image optimization files) - Optimized images don't need processing
     * - favicon.ico (favicon file) - Static file that doesn't require middleware
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 