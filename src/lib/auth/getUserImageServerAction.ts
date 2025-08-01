'use server'

import { auth } from "@/src/lib/auth/authConfig"

export const getUserImage = async () => {
    const session = await auth();
    if (session) {
        const image = session.user?.image;
        console.log('User image from session:', image);
        return image;    
    }
    return null;
};