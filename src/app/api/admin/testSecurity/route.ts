import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';
import { validateReviewContent } from '@/src/utils/sanitizeReview';

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Test the sanitization
    const validation = validateReviewContent(content);
    
    return NextResponse.json({
      success: true,
      originalContent: content,
      sanitizedContent: validation.sanitizedContent,
      isValid: validation.isValid,
      errors: validation.errors
    });
  } catch (error) {
    console.error('Error testing security:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 