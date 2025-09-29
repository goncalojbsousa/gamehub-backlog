'use server'

import { auth } from "@/src/lib/auth/authConfig";

export const checkIsOwnProfile = async (username: string) => {
    const session = await auth();
    if (session?.user?.username === username) {
        return true;
    }
    return false;
}; 