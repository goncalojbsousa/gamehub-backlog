import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const { searchParams } = new URL(req.url);
  // Satisfy Auth.js v5 by ensuring a code param exists
  if (!searchParams.has("code")) {
    const url = new URL(req.url);
    url.searchParams.set("code", "123");
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/callback/${provider}?${searchParams.toString()}`);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  // Return a fake token response to satisfy the token exchange step
  return NextResponse.json({
    access_token: "fake_access_token",
    token_type: "Bearer",
    provider,
  });
}
