'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getUserRole = async () => {
    const session = await auth();
    if (session) {
        const uuid: string = session.user?.id || '';

        // SANITIZE INPUT
        const uuidRegExp: RegExp =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
            throw new Error("Invalid UUID");
        };

        try {
            const user = await prisma.user.findUnique({
                where: { id: uuid },
                select: { role: true }
            });
            return user?.role;
        } finally {
            await prisma.$disconnect();
        }
    }
};