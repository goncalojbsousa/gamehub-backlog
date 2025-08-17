import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

// Use shared Prisma client (singleton) to avoid opening too many DB connections in dev/HMR

// Validates payload for creating a report. Currently only REVIEW is supported.
const createReportSchema = z.object({
  targetType: z.enum(['REVIEW']), // extensible later
  targetId: z.number().int().positive(),
  reason: z.string().min(5).max(500)
});

/**
 * POST /api/report/create
 * Creates a new content report. Prevents duplicates per reporter/target pair.
 * When the target is a review, stores:
 * - reportedUserId (author of the review)
 * - targetContent (snapshot of review text)
 * - targetUrl (admin redirect to deep link the review)
 */
export async function POST(request: Request) {
  try {
    // Authenticate and obtain the reporter ID
    const reporterId = await getUserId();
    if (!reporterId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request payload
    const body = await request.json();
    const data = createReportSchema.parse(body);

    // Validate target exists (for REVIEW) and get snapshot info
    let reportedUserId: string | null = null;
    let targetContent: string | null = null;
    let targetUrl: string | null = null;
    if (data.targetType === 'REVIEW') {
      const review = await prisma.review.findUnique({ where: { id: data.targetId } });
      if (!review) {
        return NextResponse.json({ error: 'Reported review not found' }, { status: 404 });
      }
      reportedUserId = review.userId;
      targetContent = review.content ?? null;
      // Use admin redirect route that resolves slug and anchors to the review
      targetUrl = `/admin/review/${review.id}`;
    }

    try {
      const report = await prisma.report.create({
        data: {
          reporterId,
          targetType: data.targetType,
          targetId: data.targetId,
          reason: data.reason,
          status: 'PENDING',
          reportedUserId: reportedUserId ?? undefined,
          targetContent: targetContent ?? undefined,
          targetUrl: targetUrl ?? undefined
        }
      });
      return NextResponse.json({ success: true, report }, { status: 201 });
    } catch (e: any) {
      // Handle duplicate report (unique constraint)
      if (e?.code === 'P2002') {
        return NextResponse.json({ error: 'You have already reported this content' }, { status: 409 });
      }
      console.error('Error creating report:', e);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    console.error('Unexpected error creating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
