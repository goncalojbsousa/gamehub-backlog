'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

export async function POST() {
  const cookieStore = await cookies();
  const targetUserId = cookieStore.get('steam_link_user_id')?.value;
  const currentUserId = await getUserId();

  if (!currentUserId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  if (!targetUserId) {
    return NextResponse.json({ message: 'Missing link cookie' }, { status: 400 });
  }

  try {
    // Find steam account for the CURRENT session user (the one that just returned from Steam)
    const steamAccount = await prisma.account.findFirst({
      where: { userId: currentUserId, provider: 'steam' },
    });

    if (!steamAccount) {
      return NextResponse.json({ message: 'Steam account not found for current user' }, { status: 404 });
    }

    const steamId = steamAccount.providerAccountId;

    // Link steamId to target user and move account to target user
    await prisma.$transaction(async (tx) => {
      // Assign steamId to the target user
      await tx.user.update({ where: { id: targetUserId }, data: { steamId } });

      // Move account to the target user (upsert for safety)
      await tx.account.upsert({
        where: { provider_providerAccountId: { provider: 'steam', providerAccountId: steamId } },
        update: { userId: targetUserId },
        create: {
          userId: targetUserId,
          provider: 'steam',
          type: 'oauth',
          providerAccountId: steamId,
        },
      });

      // If current user is a steam-only synthetic account with no other providers and no email, delete it
      if (currentUserId !== targetUserId) {
        const otherAccounts = await tx.account.count({ where: { userId: currentUserId, NOT: { provider: 'steam' } } });
        const currentUser = await tx.user.findUnique({ where: { id: currentUserId }, select: { email: true } });
        if (otherAccounts === 0 && (!currentUser?.email || currentUser.email.endsWith('@steamcommunity.com'))) {
          // Remove the user (accounts pointing to it have been moved)
          await tx.user.delete({ where: { id: currentUserId } });
        }
      }
    });

    // Clear cookie
    const res = NextResponse.json({ success: true });
    res.cookies.delete('steam_link_user_id');
    return res;
  } catch (error) {
    console.error('Error completing Steam link:', error);
    return NextResponse.json({ message: 'Failed to complete Steam link' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
