// app/api/auth/logout/route.ts

// Next.js Route Handler for logout
// Clears all auth cookies from the server
// Called by the logout button and automatically on 401 responses

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete token HttpOnly Cookie
    cookieStore.delete("token");

    // Delete user Cookie
    cookieStore.delete("user");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

  } catch {
    return NextResponse.json(
      { message: "Something went wrong during logout" },
      { status: 500 }
    );
  }
}