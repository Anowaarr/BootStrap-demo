import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser, findUserById } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const freshUser = await findUserById(user.id);
    return NextResponse.json({ user: freshUser });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, city } = body;

    const updated = await updateUser(user.id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update profile" }, { status: 500 });
  }
}
