// middleware.ts

// Next.js Middleware — runs on the server before every request
// Handles authentication and role-based route protection
// Reads token and user from Cookies — cannot access localStorage

import { NextRequest, NextResponse } from "next/server";
import { ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { canAccess } from "@/lib/utils/permissions";
import type { UserRole } from "@/types/api.types";

// ─────────────────────────────────────────────────────
// ROUTE TO RESOURCE MAPPING
// Maps URL paths to permission resource names
// Used to check if user has access to a route
// ─────────────────────────────────────────────────────
const ROUTE_PERMISSIONS: Record<string, string> = {
  "/students":          "students",
  "/teachers":          "teachers",
  "/classes":           "classes",
  "/subjects":          "subjects",
  "/grades":            "grades",
  "/attendances":       "attendances",
  "/admin/users":       "users",
  "/admin/roles":       "roles",
  "/reports":           "reports",
  "/teacher/my-classes": "my-classes",
  "/student/my-profile": "my-profile",
  "/student/my-grades":  "my-grades",
  "/student/my-attendance": "my-attendance",
};

// ─────────────────────────────────────────────────────
// MIDDLEWARE FUNCTION
// ─────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token and user from Cookies
  // These were set by the login Route Handler
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  // ─────────────────────────────────────────────────
  // STEP 1: CHECK IF ROUTE IS PUBLIC
  // Public routes don't need authentication
  // ─────────────────────────────────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route
  );

  // ─────────────────────────────────────────────────
  // STEP 2: NOT AUTHENTICATED
  // No token → redirect to login
  // Unless already on a public route
  // ─────────────────────────────────────────────────
  if (!token) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Save the original URL to redirect back after login
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─────────────────────────────────────────────────
  // STEP 3: AUTHENTICATED BUT ON PUBLIC ROUTE
  // Already logged in → redirect to dashboard
  // ─────────────────────────────────────────────────
  if (token && isPublicRoute) {
    return NextResponse.redirect(
      new URL(ROUTES.DASHBOARD, request.url)
    );
  }

  // ─────────────────────────────────────────────────
  // STEP 4: CHECK ROLE-BASED ACCESS
  // Parse user from Cookie to get role
  // Check if role has permission to access this route
  // ─────────────────────────────────────────────────
  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      const role = user.role as UserRole;

      // Find matching resource for current path
      const resource = Object.keys(ROUTE_PERMISSIONS).find(
        (route) => pathname.startsWith(route)
      );

      // If route has permission requirement
      // and user doesn't have access → redirect to dashboard
      if (resource && !canAccess(role, ROUTE_PERMISSIONS[resource])) {
        return NextResponse.redirect(
          new URL(ROUTES.DASHBOARD, request.url)
        );
      }

    } catch {
      // User Cookie is corrupted → logout
      const response = NextResponse.redirect(
        new URL(ROUTES.AUTH.LOGIN, request.url)
      );
      response.cookies.delete("token");
      response.cookies.delete("user");
      return response;
    }
  }

  // ─────────────────────────────────────────────────
  // STEP 5: ALL CHECKS PASSED → ALLOW REQUEST
  // ─────────────────────────────────────────────────
  return NextResponse.next();
}

// ─────────────────────────────────────────────────────
// MATCHER CONFIGURATION
// Defines which routes the middleware runs on
// Excludes: API routes, static files, images, favicon
// ─────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};