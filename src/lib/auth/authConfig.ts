import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { clearStaleTokens } from "@/src/lib/auth/clearStaleTokenServerAction";
import { setName } from "@/src/lib/auth/setNameServerAction";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { generateUniqueUsername } from "./generateUniqueUsernameServerAction";

declare module "next-auth" {
    interface User {
        username?: string;
    }
}
const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 DAYS IN SECONDS (DEFAULT AUTH.JS VALUE)
    },
    pages: {
        signIn: "/auth/sign-in",
        verifyRequest: "/auth/auth-success",
        error: "/auth/auth-error",
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM
        })
    ],
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (user) {
                await clearStaleTokens();

                if (!user.username && user.name) {
                    const username = await generateUniqueUsername(user.name);
                    await prisma.user.update({
                        where: { id: user.id as string },
                        data: { username },
                    });
                    user.username = username;
                }

                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                };
            }

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
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    username: token.username as string,
                },
            };
        },
    },
})