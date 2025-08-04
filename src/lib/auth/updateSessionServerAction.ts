'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateSession = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return false;
    }

    try {
        // Fetch updated user data
        const userData = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                username: true,
                image: true,
            }
        });

        if (!userData) {
            return false;
        }

        // Update session with new data
        session.user.name = userData.name;
        session.user.username = userData.username;
        session.user.image = userData.image;

        return true;
    } catch (error) {
        console.error('Error updating session:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}; 