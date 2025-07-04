// This file is obsolete now that auth is handled by a real backend.
// It is kept for reference but should be deleted in a real project.

import { getSession } from "@/features/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (user) {
    return NextResponse.json({ user });
  }
  return new NextResponse('Unauthorized', { status: 401 });
}
