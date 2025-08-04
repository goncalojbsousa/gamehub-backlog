'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { updateSession } from '@/src/lib/auth/updateSessionServerAction';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  username: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  bio: z.string().max(500).optional(),
  isProfilePublic: z.boolean().optional(),
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
    validatedInput = updateProfileSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
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
    // If username is being updated, check for uniqueness
    if (validatedInput.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedInput.username,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return NextResponse.json({ 
          message: 'Username already taken' 
        }, { status: 409 });
      }
    }

    // Update user profile
    const updateData: any = {};
    
    if (validatedInput.name) {
      updateData.name = validatedInput.name.trim();
    }
    if (validatedInput.username) {
      updateData.username = validatedInput.username.trim();
    }
    if (validatedInput.bio !== undefined) {
      updateData.bio = validatedInput.bio.trim() || null;
    }
    if (validatedInput.isProfilePublic !== undefined) {
      updateData.isProfilePublic = validatedInput.isProfilePublic;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        isProfilePublic: true,
      }
    });

    // If username was updated, force session update
    if (validatedInput.username) {
      await updateSession();
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ 
      message: 'Failed to update profile' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 