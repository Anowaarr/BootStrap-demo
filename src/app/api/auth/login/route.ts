import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = user;
    await setAuthCookie(safeUser);

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: `Welcome back, ${safeUser.name}!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
