import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)',
  '/settings',
  '/customers',
  '/invoices',
  '/products',
  '/orders',
  '/reports',
  '/settings(.*)',
  '/forum(.*)'])

export default clerkMiddleware((auth, req) => {
  try {
    auth().protect();

    if (isProtectedRoute(req)) auth().protect()
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/sign-in", req.url).href);
    
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}