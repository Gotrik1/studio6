
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (user) {
    return NextResponse.json({ user });
  }
  return new NextResponse('Unauthorized', { status: 401 });
}
