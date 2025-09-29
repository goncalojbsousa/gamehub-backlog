'use server'

import { signOut } from "@/src/lib/auth/authConfig";

export const handleSignOut = async () => {
    try {
        await signOut({
            redirect: false,
            redirectTo: '/'
        });
    } catch (error) {
        console.error('Erro no signOut:', error);
        throw error;
    }
}