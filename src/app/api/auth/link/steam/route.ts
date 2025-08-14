'use server'

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { signIn } from '@/src/lib/auth/authConfig';

export async function GET() {
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXTAUTH_URL));
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXTAUTH_URL));
  }

  // Prepare callback and mark intent cookie
  const callbackUrl = `${process.env.NEXTAUTH_URL}/user/settings?linked=1`;
  const isSecure = (process.env.NEXTAUTH_URL?.startsWith('https://')) || process.env.NODE_ENV === 'production';
  (await cookies()).set('steam_link_user_id', userId, { httpOnly: true, sameSite: 'lax', path: '/', secure: Boolean(isSecure) });

  // Initiate OAuth via NextAuth server helper (will throw/return a redirect)
  return await signIn('steam', { redirectTo: callbackUrl });
}
