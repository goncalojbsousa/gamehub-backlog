'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const unlinkGoogleAccount = async () => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const uuid: string = session.user?.id || '';

    // SANITIZE INPUT
    const uuidRegExp: RegExp =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
        throw new Error("Invalid UUID");
    }

    try {
        await prisma.account.deleteMany({
            where: {
                provider: 'google',
                userId: uuid
            }
        });
        return true;
    } catch (error) {
        console.error("Failed to unlink google account", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}