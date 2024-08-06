'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { PrismaClient } from '@prisma/client'
import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";

const prisma = new PrismaClient()

export const getAllUsers = async (limit: number, offset: number) => {
    const session = await auth();
    const role = await getUserRole();

    if (!session || role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const uuid: string = session.user?.id || "";

    // SANITIZE INPUT
    const uuidRegExp: RegExp =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
        throw new Error("Invalid UUID");
    }

    // VALIDATE LIMIT AND OFFSET
    if (typeof limit !== "number" || limit <= 0) {
        throw new Error("Invalid limit value");
    }
    if (typeof offset !== "number" || offset < 0) {
        throw new Error("Invalid offset value");
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
            },
            orderBy: {
                id: 'asc'
            },
            take: limit,
            skip: offset
        });

        return users;
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect()
    }
};