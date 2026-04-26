// app/api/auth/login/route.ts

// Next.js Route Handler for login
// Acts as a proxy between the client and the backend
// Handles two cases:
//   1. Login successful + role assigned   → set cookies + return user
//   2. Login successful + role pending    → set token cookie only + return pending status

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isPendingRole, type BackendLoginResponse } from "@/features/auth/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// ─────────────────────────────────────────────────────
// COOKIE OPTIONS
// secure: false — backend runs on HTTP not HTTPS
// httpOnly: true — JavaScript cannot access token cookie
// sameSite: lax — protects against CSRF attacks
// maxAge: 3600 — 1 hour matches JWT expiration
// ─────────────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 60 * 60,
  path: "/",
};

export async function POST(request: NextRequest) {
  try {
    // 1. Get credentials from the request body
    const body = await request.json();

    // 2. Forward credentials to the real backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/Auth/Login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // 3. If backend returns an error → forward it to the client
    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, {
        status: backendResponse.status,
      });
    }

    // 4. Parse backend response
    const data: BackendLoginResponse = await backendResponse.json();

    // ─────────────────────────────────────────────────
    // CASE 1: Role is Pending
    // User is authenticated but has no role yet
    // Store token cookie so middleware knows they're logged in
    // Tell client to redirect to /pending page
    // ─────────────────────────────────────────────────
    if (isPendingRole(data)) {
      const cookieStore = await cookies();

      // Store token — user IS authenticated
      cookieStore.set("token", data.token, COOKIE_OPTIONS);

      // Return pending status — no user cookie needed
      return NextResponse.json(
        {
          status: "pending",
          message: data.message,
        },
        { status: 200 }
      );
    }

    // ─────────────────────────────────────────────────
    // CASE 2: Role is assigned — normal login flow
    // Store both token and user cookies
    // Return user data to client
    // ─────────────────────────────────────────────────
    const cookieStore = await cookies();

    // Store token in HttpOnly Cookie
    // JavaScript on the client cannot read this
    cookieStore.set("token", data.token, COOKIE_OPTIONS);

    // Store user data in a regular cookie
    // Client needs to read this for UI (name, role, etc.)
    cookieStore.set(
      "user",
      JSON.stringify(data.user),
      {
        ...COOKIE_OPTIONS,
        httpOnly: false, // Client needs to read this for UI
      }
    );

    // Return user data to client — token stays in cookie
    return NextResponse.json(
      { user: data.user },
      { status: 200 }
    );

  } catch {
    // Network error or backend is down
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}