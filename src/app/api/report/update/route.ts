import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { auth } from '@/src/lib/auth/authConfig';

// use shared prisma

const updateSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['PENDING', 'RESOLVED', 'DISMISSED']),
  resolutionNotes: z.string().max(2000).optional()
});

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const data = updateSchema.parse(body);

    const updated = await (prisma as any).report.update({
      where: { id: data.id },
      data: {
        status: data.status as any,
        resolutionNotes: data.resolutionNotes,
        moderatorId: user.id,
        resolvedAt: data.status === 'PENDING' ? null : new Date()
      }
    });

    return NextResponse.json({ success: true, report: updated }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

