'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const setName = async (name: string) => {
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

    name = name.trim();

    try {
        await prisma.user.update({
            where: { id: uuid },
            data: { name: name }
        });
        return true;
    } finally {
        await prisma.$disconnect();
    }
}