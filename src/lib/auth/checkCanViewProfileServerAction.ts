'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkCanViewProfile = async (targetUsername: string) => {
    const session = await auth();
    if (!session?.user?.id) {
        return false;
    }

    try {
        // Check if current user is admin
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        // If user is admin, they can view any profile
        if (currentUser?.role === 'ADMIN') {
            return true;
        }

        // If user is viewing their own profile, they can always view it
        if (session.user.username === targetUsername) {
            return true;
        }

        // Check if target profile is public
        const targetUser = await prisma.user.findFirst({
            where: { username: targetUsername },
            select: { isProfilePublic: true }
        });

        return targetUser?.isProfilePublic || false;
    } catch (error) {
        console.error('Error checking profile visibility:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}; 