'use server'

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export async function generateUniqueUsername(name: string) {
    const baseUsername = slugify(name, { lower: true });
    let username = baseUsername;
    let counter = 1;

    while (true) {
        const existingUser = await prisma.user.findFirst({
            where: { username },
        });

        if (!existingUser) {
            return username;
        }

        username = `${baseUsername}${counter}`;
        counter += 1;
    }
}