import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { auth } from '@/src/lib/auth/authConfig';

// Uses shared Prisma client (singleton) from src/lib/prisma

const querySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  status: z.enum(['PENDING', 'RESOLVED', 'DISMISSED']).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate query params
    const url = new URL(request.url);
    const parseResult = querySchema.safeParse({
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
      status: (url.searchParams.get('status') as any) ?? undefined,
    });
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: parseResult.error.format() }, { status: 400 });
    }

    const page = Math.max(1, parseInt(parseResult.data.page || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(parseResult.data.pageSize || '20', 10)));
    // Optional status filter
    const where: any = {};
    if (parseResult.data.status) where.status = parseResult.data.status;

    // Fetch page + count in parallel; include related users for table display
    const [items, total] = await Promise.all([
      (prisma as any).report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          // Include minimal user info for reporter, reportedUser and moderator
          reporter: { select: { id: true, username: true, name: true, image: true } },
          reportedUser: { select: { id: true, username: true, name: true, image: true } },
          moderator: { select: { id: true, username: true, name: true, image: true } },
        },
      }),
      (prisma as any).report.count({ where }),
    ]);

    // Response shape expected by admin UI
    return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
  } catch (error) {
    console.error('Error listing reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
