import { NextResponse } from 'next/server';
import { getSession } from '@/features/auth/session';

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only return the user object, not the access token to the client
  return NextResponse.json({ user: session.user });
}
