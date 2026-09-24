import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address, city, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Default to customer role unless explicitly created with admin key
    const assignedRole = role === "admin" ? "admin" : "customer";

    const newUser = await createUser({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || "",
      address: address || "",
      city: city || "Dhaka",
    });

    await setAuthCookie(newUser);

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Account created successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
