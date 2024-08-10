'use server'

import { auth } from "@/src/lib/auth/authConfig"

export const getUserNameSlug = async () => {
    const session = await auth();
    if (session) {
        return session.user?.username;    
    }
};