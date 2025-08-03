'use server'

import { signOut } from "@/src/lib/auth/authConfig";

export const handleSignOut = async () => {
    try {
        await signOut({
            redirect: false,
            callbackUrl: '/'
        });
    } catch (error) {
        console.error('Erro no signOut:', error);
        throw error;
    }
}