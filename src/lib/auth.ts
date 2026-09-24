import { cookies } from "next/headers";
import { findUserById, findUserByEmail } from "./db";
import { User } from "@/types";

const COOKIE_NAME = "chaldal_auth_session";

export interface SessionData {
  userId: string;
  email: string;
  role: "customer" | "admin";
}

export function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

export function decodeSession(token: string): SessionData | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const session = decodeSession(token);
    if (!session || !session.userId) return null;

    const user = await findUserById(session.userId);
    return user || null;
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: User): Promise<void> {
  const cookieStore = await cookies();
  const token = encodeSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
