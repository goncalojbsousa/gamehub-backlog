import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';
import { getAdminLogs } from '@/src/utils/adminLogger';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const action = url.searchParams.get('action') || undefined;
    const adminId = url.searchParams.get('adminId') || undefined;
    const targetType = url.searchParams.get('targetType') || undefined;
    const startDate = url.searchParams.get('startDate') || undefined;
    const endDate = url.searchParams.get('endDate') || undefined;

    // Parse dates if provided
    const filters = {
      action,
      adminId,
      targetType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    const result = await getAdminLogs(page, limit, filters);

    return NextResponse.json({
      logs: result.logs,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 