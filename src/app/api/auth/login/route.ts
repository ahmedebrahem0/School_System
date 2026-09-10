// app/api/auth/login/route.ts

// Next.js Route Handler for login
// Acts as a proxy between the client and the backend
// Handles two cases:
//   1. Login successful + role assigned   -> set cookies + return user/token
//   2. Login successful + role pending    -> set token cookie + return pending status/token

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { isPendingRole, type BackendLoginResponse } from "@/features/auth/types";
import type { AuthUser, UserRole } from "@/types/api.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 60 * 60,
  path: "/",
};

interface LoginTokenClaims {
  sub?: string;
  UserId?: string;
  email?: string;
  gender?: string;
  fullName?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: UserRole;
}

const toAuthUser = (data: BackendLoginResponse): AuthUser | null => {
  if ("user" in data && data.user) {
    return data.user;
  }

  const claims = jwtDecode<LoginTokenClaims>(data.token);
  const role =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!role) {
    return null;
  }

  const id =
    claims.UserId ||
    claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    "";
  const userName = claims.sub || claims.email || "User";

  return {
    id,
    userName,
    fullName: claims.fullName || userName,
    email: claims.email || "",
    gender: claims.gender || "",
    role,
  };
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

    const user = toAuthUser(data);

    if (!user) {
      return NextResponse.json(
        {
          status: "pending",
          message: "Your account is pending role assignment.",
          token: data.token,
        },
        { status: 200 }
      );
    }

    cookieStore.set("user", JSON.stringify(user), {
      ...COOKIE_OPTIONS,
      httpOnly: false,
    });

    return NextResponse.json(
      { user, token: data.token },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
