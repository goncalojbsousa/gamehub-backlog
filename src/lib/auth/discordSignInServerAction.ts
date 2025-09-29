'use server'

import { signIn } from "@/src/lib/auth/authConfig";

export const handleDiscordSignIn = async () => {
    try {
        await signIn("discord", { redirectTo: "/" })
    } catch (error) {
        throw error;
    }
}
