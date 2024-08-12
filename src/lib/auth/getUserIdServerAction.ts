'use server'

import { auth } from "@/src/lib/auth/authConfig"

export const getUserId = async () => {
    const session = await auth();
    if (session) {
        return session.user?.id;
    }
    return null;
};