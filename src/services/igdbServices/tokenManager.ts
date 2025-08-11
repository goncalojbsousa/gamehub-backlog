'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Small safety window (seconds) to refresh a bit before actual expiry
const EXPIRY_SKEW_SECONDS = 60;

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number; // seconds
  token_type: string; // e.g., "bearer"
}

async function requestNewIgdbToken(): Promise<{ token: string; tokenType: string; expiresAt: Date }> {
  const clientId = process.env.IGDB_CLIENT;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('IGDB client credentials are not configured (IGDB_CLIENT, IGDB_CLIENT_SECRET).');
  }

  const url = 'https://id.twitch.tv/oauth2/token';
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to obtain IGDB token from Twitch: ${resp.status} ${resp.statusText} - ${text}`);
  }

  const data = (await resp.json()) as TwitchTokenResponse;
  const now = Date.now();
  const expiresAtMs = now + Math.max(0, (data.expires_in - EXPIRY_SKEW_SECONDS)) * 1000;

  return {
    token: data.access_token,
    tokenType: data.token_type?.toLowerCase() || 'bearer',
    expiresAt: new Date(expiresAtMs),
  };
}

export async function getIgdbAccessToken(): Promise<string> {
  // Try to find existing token
  const existing = await prisma.apiToken.findUnique({ where: { provider: 'igdb' } });
  const now = new Date();

  if (existing && existing.expiresAt > now) {
    return existing.accessToken;
  }

  // Need a new token
  const fresh = await requestNewIgdbToken();

  await prisma.apiToken.upsert({
    where: { provider: 'igdb' },
    update: {
      accessToken: fresh.token,
      tokenType: fresh.tokenType,
      expiresAt: fresh.expiresAt,
      refreshedAt: new Date(),
    },
    create: {
      provider: 'igdb',
      accessToken: fresh.token,
      tokenType: fresh.tokenType,
      expiresAt: fresh.expiresAt,
      refreshedAt: new Date(),
    },
  });

  return fresh.token;
}
