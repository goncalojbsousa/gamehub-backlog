'use server'

import { auth } from "@/src/lib/auth/authConfig"

export const getUserImage = async () => {
    const session = await auth();
    if (session && session.user?.image) {
        return session.user.image || '';
    }
    return '';
};