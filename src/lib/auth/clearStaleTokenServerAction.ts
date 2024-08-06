'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const clearStaleTokens = async () => {
    try {
        await prisma.verificationToken.deleteMany({
            where: {
                expires: {
                    lt: new Date()
                }
            }
        });
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect()
    }
}