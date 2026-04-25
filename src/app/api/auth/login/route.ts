// app/api/auth/login/route.ts

// Next.js Route Handler for login
// Acts as a proxy between the client and the backend
// Receives credentials, gets token from backend
// and stores it in an HttpOnly Cookie

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { LoginResponse } from "@/types/api.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// Cookie configuration
// Used to set consistent cookie options
const COOKIE_OPTIONS = {
    httpOnly: true,    // JavaScript cannot access this cookie
    // secure: process.env.NODE_ENV === "production", // HTTPS only in production
    secure: false, // HTTP only in production

    sameSite: "lax" as const,  // Protects against CSRF attacks
    maxAge: 60 * 60,  // 1 hour — matches JWT expiration
    path: "/",        // Cookie is valid for all routes
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

        // 4. Extract token and user from backend response
        const data: LoginResponse = await backendResponse.json();
        const { token, user } = data;

        // 5. Store token in HttpOnly Cookie
        // JavaScript on the client cannot read this
        const cookieStore = await cookies();

        cookieStore.set("token", token, COOKIE_OPTIONS);

        // 6. Store user data in a regular cookie
        // Client needs to read user data for UI (name, role, etc.)
        // Not sensitive data — just display info
        cookieStore.set(
            "user",
            JSON.stringify(user),
            {
                ...COOKIE_OPTIONS,
                httpOnly: false, // Client needs to read this for UI
            }
        );

        // 7. Return user data to the client
        // Do NOT return the token — it's safely in the HttpOnly Cookie
        return NextResponse.json({ user }, { status: 200 });

    } catch {
        // Network error or backend is down
        return NextResponse.json(
            { message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}