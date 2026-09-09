// app/api/auth/login/route.ts

// Next.js Route Handler for login
// Acts as a proxy between the client and the backend
// Handles two cases:
//   1. Login successful + role assigned   -> set cookies + return user/token
//   2. Login successful + role pending    -> set token cookie + return pending status/token

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isPendingRole, type BackendLoginResponse } from "@/features/auth/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 60 * 60,
  path: "/",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_URL}/api/Auth/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, {
        status: backendResponse.status,
      });
    }

    const data: BackendLoginResponse = await backendResponse.json();
    const cookieStore = await cookies();

    cookieStore.set("token", data.token, COOKIE_OPTIONS);

    if (isPendingRole(data)) {
      return NextResponse.json(
        {
          status: "pending",
          message: data.message,
          token: data.token,
        },
        { status: 200 }
      );
    }

    cookieStore.set("user", JSON.stringify(data.user), {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    });

    return NextResponse.json(
      { user: data.user, token: data.token },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
