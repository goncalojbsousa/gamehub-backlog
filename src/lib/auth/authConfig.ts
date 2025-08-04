import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { clearStaleTokens } from "@/src/lib/auth/clearStaleTokenServerAction";
import { setName } from "@/src/lib/auth/setNameServerAction";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { generateUniqueUsername } from "./generateUniqueUsernameServerAction";

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
export const { handlers, signIn, signOut, auth } = NextAuth({
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
        /**
         * JWT callback - Handles token creation and updates
         * Runs when a JWT is created or updated
         */
        async jwt({ token, user, session, trigger }) {
            // Handle initial user sign-in
            if (user) {
                // Clear any stale tokens from previous sessions
                await clearStaleTokens();

                // Generate unique username if user doesn't have one
                if (!user.username && user.name) {
                    const username = await generateUniqueUsername(user.name);
                    await prisma.user.update({
                        where: { id: user.id as string },
                        data: { username },
                    });
                    user.username = username;
                }

                // Return token with user information
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    image: user.image, // Ensure image is included in token
                };
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
            // Always fetch the latest user data from database for consistency
            try {
                const userData = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: {
                        name: true,
                        username: true,
                        image: true,
                    }
                });

                // Return session with fresh user data
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id as string,
                        name: userData?.name || session.user.name,
                        username: userData?.username || token.username as string,
                        image: userData?.image || token.image as string,
                    },
                };
            } catch (error) {
                console.error('Error fetching user data in session callback:', error);
                // Fallback to token data if database query fails
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id as string,
                        username: token.username as string,
                        image: token.image as string,
                    },
                };
            }
        },
    },
})