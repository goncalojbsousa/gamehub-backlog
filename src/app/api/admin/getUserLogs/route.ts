'use server'

import { NextResponse } from 'next/server';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { getUserLogs } from '@/src/utils/userLogger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // CHECK IS AUTHENTICATED
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden - Admin access required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action') || undefined;
    const targetUserId = searchParams.get('userId') || undefined;
    const targetType = searchParams.get('targetType') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    const filters = {
      action,
      userId: targetUserId,
      targetType,
      startDate,
      endDate
    };

    const result = await getUserLogs(page, limit, filters);

    return NextResponse.json({
      logs: result.logs,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch user logs' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

