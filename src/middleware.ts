import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { getShopIdForUser } from "./db/queries";

const protectedRoutes = createRouteMatcher([
  "/dashboard",
  "/customers",
  "/products",
  "/invoices",
  "/settings(.*)",
  "/api/(.*)*", 
]);

const publicRoutes = createRouteMatcher(["/sign-in(.*)","/sign-up", "/", "/onboarding"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-custom-header", "khata-app");

  if (protectedRoutes(req)) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    try {
      auth().protect();
      const { userId } = auth();
      console.log('---------------------------------------------------');
      console.log('userId middleware 25', userId);
      console.log('---------------------------------------------------');
      requestHeaders.set("clerk_id", userId || "");

      // Check if user has a shop associated
      const shopResponse = await getShopIdForUser(userId!);
      if (!shopResponse) {
        // If user doesn't have a shop, redirect to onboarding
        return NextResponse.redirect(new URL("/onboarding", req.url).href);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log('Authentication error:', error);
      return NextResponse.redirect(new URL("/sign-in", req.url).href);
    }
  }


  if (publicRoutes(req)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }


  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};