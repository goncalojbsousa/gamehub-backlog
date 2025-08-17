'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

const checkUsernameSchema = z.object({
  username: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_-]+$/),
});

export async function POST(request: Request) {
  // CHECK IS AUTHENTICATED
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  // GET CLIENT IP
  const headersList = await headers();
  const clientIp = headersList.get('x-forwarded-for') || 'unknown';

  if (typeof clientIp !== 'string') {
    throw new Error('Access temporarily blocked. Try again later.');
  }

  if (clientIp === 'unknown') {
    throw new Error('Access temporarily blocked. Try again later.');
  }

  if (!(await checkRateLimit(clientIp))) {
    throw new Error('Limit rate exceeded. Try again later.');
  }

  // VALIDATE INPUT
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ 
      message: 'Invalid JSON in request body' 
    }, { status: 400 });
  }

  let validatedInput;
  try {
    validatedInput = checkUsernameSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ 
        message: `Validation error: ${fieldErrors}` 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      message: 'Invalid input data' 
    }, { status: 400 });
  }

  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: validatedInput.username,
        id: { not: userId }
      },
      select: { id: true }
    });

    const isAvailable = !existingUser;

    return NextResponse.json({ 
      available: isAvailable,
      message: isAvailable ? 'Username is available' : 'Username is already taken'
    });

  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ 
      message: 'Failed to check username availability' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 