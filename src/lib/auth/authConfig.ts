import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import Discord from "next-auth/providers/discord";
import SteamProvider from "authjs-steam-provider";
import { clearStaleTokens } from "@/src/lib/auth/clearStaleTokenServerAction";
import { setName } from "@/src/lib/auth/setNameServerAction";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { generateUniqueUsername } from "./generateUniqueUsernameServerAction";

// Debug: ensure env vars are loaded (no secrets printed)
if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[Auth] Discord env present:', {
        id: Boolean(process.env.AUTH_DISCORD_ID),
        secret: Boolean(process.env.AUTH_DISCORD_SECRET),
    });
}

/**
 * Extends the NextAuth User interface to include custom fields
 * This ensures TypeScript recognizes our custom user properties
 */
declare module "next-auth" {
    interface User {
        username?: string; // Custom username field for profile URLs
    }
}

// Initialize Prisma client for database operations
const prisma = new PrismaClient()

/**
 * NextAuth configuration object
 * Defines authentication providers, session strategy, and custom callbacks
 */
export const { handlers, signIn, signOut, auth } = NextAuth((req) => ({
    trustHost: true, // Trust the host for secure cookie handling
    adapter: PrismaAdapter(prisma), // Use Prisma adapter for database storage
    secret: process.env.AUTH_SECRET, // Secret key for JWT signing

    // Session configuration
    session: {
        strategy: "jwt", // Use JWT strategy for session management
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (default Auth.js value)
    },

    // Custom page routes for authentication flows
    pages: {
        signIn: "/auth/sign-in", // Custom sign-in page
        verifyRequest: "/auth/auth-success", // Email verification success page
        error: "/auth/auth-error", // Authentication error page
    },

    // Authentication providers configuration
    providers: [
        // Steam provider (authjs-steam-provider)
        SteamProvider((req ?? new Request(`${process.env.NEXTAUTH_URL}/api/auth`)) as Request, {
            clientSecret: process.env.NEXTAUTH_STEAM_SECRET!,
            callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/oauth-proxy`,
        }),
        // Google OAuth provider
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
            authorization: {
                params: {
                    scope: 'openid email profile', // Requested OAuth scopes
                },
            },
        }),
        // Discord OAuth provider
        Discord({
            clientId: process.env.AUTH_DISCORD_ID!,
            clientSecret: process.env.AUTH_DISCORD_SECRET!,
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                    scope: 'identify email',
                },
            },
            profile(profile) {
                // Ensure we only keep name, email, image (username handled separately)
                return {
                    id: profile.id,
                    name: profile.global_name || profile.username,
                    email: profile.email,
                    image: profile.avatar
                        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                        : undefined,
                } as any;
            },
        }),

        // Email provider for passwordless authentication
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM // Sender email address
        })
    ],

    // Custom callbacks for token and session management
    callbacks: {
        // Intercept Steam linking to resolve OAuthAccountNotLinked by transferring from synthetic owners
        async signIn({ user, account }) {
            try {
                if (account?.provider === 'steam') {
                    const steamId = account.providerAccountId;
                    // Read target user from cookie set by /api/auth/link/steam
                    const cookieHeader = (req as Request | undefined)?.headers?.get?.('cookie') ?? '';
                    const match = /(?:^|;\s*)steam_link_user_id=([^;]+)/.exec(cookieHeader);
                    const targetUserIdFromCookie = match ? decodeURIComponent(match[1]) : undefined;
                    const targetUserId = targetUserIdFromCookie || user?.id;

                    if (!steamId || !targetUserId) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('[auth][signIn] steam pre-transfer skipped (missing steamId or user.id)', { hasSteamId: Boolean(steamId), hasUserId: Boolean(user?.id) });
                        }
                        return true;
                    }

                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[auth][signIn] steam attempt', { userId: targetUserId, steamId, hasCookieTarget: Boolean(targetUserIdFromCookie) });
                    }

                    // Find existing owner by Account
                    const existing = await prisma.account.findUnique({
                        where: { provider_providerAccountId: { provider: 'steam', providerAccountId: steamId } },
                        select: { userId: true },
                    });
                    let ownerId = existing?.userId;

                    // Fallback: if no Account record, try by User.steamId
                    if (!ownerId) {
                        const ownerByUser = await prisma.user.findFirst({ where: { steamId }, select: { id: true } });
                        ownerId = ownerByUser?.id;
                    }

                    if (ownerId && ownerId !== targetUserId) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('[auth][signIn] steam owned by other user, evaluating transfer', { ownerId, currentUserId: targetUserId });
                        }
                        const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { id: true, email: true } });
                        const ownerIsSynthetic = !owner?.email || owner.email.endsWith('@steamcommunity.com');
                        const currentUser = await prisma.user.findUnique({ where: { id: targetUserId }, select: { email: true } });
                        const currentUserHasRealEmail = Boolean(currentUser?.email && !currentUser.email.endsWith('@steamcommunity.com'));
                        const currentUserOtherAccounts = await prisma.account.count({ where: { userId: targetUserId, NOT: { provider: 'steam' } } });

                        if (ownerIsSynthetic && (currentUserHasRealEmail || currentUserOtherAccounts > 0)) {
                            // Pre-transfer within a transaction so Auth.js can proceed without throwing
                            await prisma.$transaction(async (tx) => {
                                // Ensure an Account row exists pointing to the current user
                                await tx.account.upsert({
                                    where: { provider_providerAccountId: { provider: 'steam', providerAccountId: steamId } },
                                    update: { userId: targetUserId as string },
                                    create: { userId: targetUserId as string, provider: 'steam', type: 'oauth', providerAccountId: steamId },
                                });
                                // Clear steamId from owner or delete if truly synthetic
                                const ownerOtherAccounts = await tx.account.count({ where: { userId: ownerId, NOT: { provider: 'steam' } } });
                                if (ownerOtherAccounts === 0) {
                                    await tx.user.delete({ where: { id: ownerId } });
                                } else {
                                    await tx.user.update({ where: { id: ownerId }, data: { steamId: null } });
                                }
                                // Assign steamId to current user (after clearing)
                                await tx.user.update({ where: { id: targetUserId as string }, data: { steamId } });
                            });
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('[auth][signIn] steam transferred from synthetic owner to current user', { from: ownerId, to: targetUserId });
                            }
                        }
                        // Not transferable:
                        // If there's no linking-intent cookie, inform UI with a targeted redirect back to settings.
                        // If a linking-intent cookie exists, allow sign-in to proceed so the client can call
                        // POST /api/user/completeSteamLink to finish the manual transfer.
                        if (!targetUserIdFromCookie) {
                            const url = new URL('/user/settings', process.env.NEXTAUTH_URL);
                            url.searchParams.set('steam_link_error', 'already_linked');
                            return url.toString();
                        }
                        return true;
                    }
                }
            } catch (e) {
                console.error('signIn callback steam pre-transfer error:', e);
                // Let Auth.js handle if our pre-transfer fails
            }
            return true;
        },
        /**
         * JWT callback - Handles token creation and updates
         * Runs when a JWT is created or updated
         */
        async jwt({ token, user, trigger, session }) {
            // If user logs in, sync token from DB as the single source of truth
            if (user) {
                await clearStaleTokens();
                const db = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { id: true, name: true, email: true, image: true, username: true },
                });
                if (db) {
                    token.id = db.id;
                    token.name = db.name;
                    token.email = db.email as any;
                    // Some adapters place image in picture; preserve both
                    (token as any).picture = db.image;
                    token.username = db.username as any;
                }
            }

            // Handle session updates (e.g., name changes)
            if (trigger === "update" && session?.name !== token.name) {
                token.name = session.name;
                try {
                    if (token.name) {
                        await setName(token.name);
                    }
                } catch (error) {
                    console.error("Failed to set user name: ", error);
                }
            }

            return token;
        },

        /**
         * Session callback - Handles session creation and updates
         * Runs when a session is checked or updated
         */
        async session({ session, token }) {
            if (!token?.id) return session;
            try {
                const db = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { id: true, name: true, email: true, image: true, username: true },
                });
                if (db) {
                    (session.user as any).id = db.id;
                    (session.user as any).username = db.username ?? undefined;
                    (session.user as any).name = db.name ?? null;
                    (session.user as any).email = db.email ?? null;
                    (session.user as any).image = db.image ?? null;
                }
            } catch (e) {
                console.error('session callback DB fetch error:', e);
                // fallback to token
                (session.user as any).id = token.id as string | undefined;
                (session.user as any).username = token.username as string | undefined;
                (session.user as any).name = (token.name as string | null) ?? null;
                (session.user as any).email = (token.email as string | null) ?? null;
                (session.user as any).image = (token.picture as string | null) ?? null;
            }
            return session;
        },
    },

    // Events happen after the adapter persists user/account
    events: {
        async createUser({ user }) {
            try {
                // Ensure every new user gets a unique username at creation time
                const base = (user.name || user.email || 'user').toString();
                const username = await generateUniqueUsername(base);
                await prisma.user.update({ where: { id: user.id }, data: { username } });
            } catch (e) {
                console.error('createUser event error:', e);
            }
        },
        async linkAccount({ user, account }) {
            try {
                if (account?.provider === 'steam') {
                    const steamId = account.providerAccountId;
                    if (!steamId) return;
                    if (!user?.id) return; // type safety

                    // Determine if some user already owns this steamId
                    const owner = await prisma.user.findFirst({ where: { steamId }, select: { id: true, email: true } });
                    if (owner && owner.id !== user.id) {
                        // If the existing owner is a steam-only synthetic (no real email or fake @steamcommunity.com)
                        // and the current user is a real user (has a non-fake email or other providers), transfer ownership
                        const ownerIsSynthetic = !owner.email || owner.email.endsWith('@steamcommunity.com');
                        const currentUser = await prisma.user.findUnique({ where: { id: user.id }, select: { email: true } });
                        const currentUserHasRealEmail = Boolean(currentUser?.email && !currentUser.email.endsWith('@steamcommunity.com'));
                        const currentUserOtherAccounts = await prisma.account.count({ where: { userId: user.id, NOT: { provider: 'steam' } } });

                        if (ownerIsSynthetic && (currentUserHasRealEmail || currentUserOtherAccounts > 0)) {
                            // Move Account to current user
                            await prisma.$transaction(async (tx) => {
                                // 1) Upsert steam account pointing to the current user
                                await tx.account.upsert({
                                    where: { provider_providerAccountId: { provider: 'steam', providerAccountId: steamId } },
                                    update: { userId: user.id as string },
                                    create: {
                                        userId: user.id as string,
                                        provider: 'steam',
                                        type: 'oauth',
                                        providerAccountId: steamId,
                                    },
                                });
                                // 2) If owner is truly synthetic (no other providers), delete it; otherwise, just clear steamId
                                const ownerOtherAccounts = await tx.account.count({ where: { userId: owner.id, NOT: { provider: 'steam' } } });
                                if (ownerOtherAccounts === 0) {
                                    await tx.user.delete({ where: { id: owner.id } });
                                } else {
                                    await tx.user.update({ where: { id: owner.id }, data: { steamId: null } });
                                }
                                // 3) Now set steamId on current user (after clearing from owner to satisfy unique constraint)
                                await tx.user.update({ where: { id: user.id as string }, data: { steamId } });
                            });
                            return;
                        }

                        // Otherwise, keep ownership with existing owner and do nothing.
                        // Note: If linking fails earlier due to unique constraints, the manual link flow handles it.
                        return;
                    }

                    // No existing owner (or owner is the same user): ensure steamId is set on this user
                    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { steamId: true } });
                    if (!dbUser?.steamId) {
                        await prisma.user.update({ where: { id: user.id }, data: { steamId } });
                    }
                }
            } catch (e) {
                console.error('linkAccount event error:', e);
            }
        },
    },
}))