'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

export async function POST() {
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { steamId: true } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove steamId from user and delete steam account record if exists
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { steamId: null } }),
      prisma.account.deleteMany({ where: { userId, provider: 'steam' } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unlinking Steam:', error);
    return NextResponse.json({ message: 'Failed to unlink Steam' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
