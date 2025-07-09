"use server";
import "server-only";
import { cookies } from "next/headers";
import type { User } from "@/shared/lib/types";

export type SessionData = {
  user: User;
  access_token: string;
};

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie);
    return session as SessionData;
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    return null;
  }
}
