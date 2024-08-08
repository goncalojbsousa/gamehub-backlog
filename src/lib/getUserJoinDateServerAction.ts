'use server'

import { PrismaClient } from "@prisma/client"
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";
import { getUserId } from "@/src/lib/auth/getUserIdServerAction";

const prisma = new PrismaClient()

export async function getUserJoinDate() {
    try {
        const isAuthenticated = await checkIsAuthenticated();

        const userId = await getUserId();

        if (!userId || !isAuthenticated) {
            console.warn('Please authenticate');
            return null;
        }

        const joinDate = await prisma.userGameStatus.findFirst({
            where: {
                userId: userId,
            },
            select: {
                createdAt: true,
            }
        });

        return joinDate || null;
    } catch (error) {
        console.error('Error fetching user join date:', error);
        throw error;
    }
}
