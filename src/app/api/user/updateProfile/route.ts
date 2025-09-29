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
import { logUserAction, USER_ACTIONS } from '@/src/utils/userLogger';

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
    // Get current user data for logging purposes
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

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

    // Log username change if it occurred
    if (validatedInput.username && currentUser.username !== validatedInput.username) {
      await logUserAction({
        action: USER_ACTIONS.USERNAME_CHANGE,
        userId: userId,
        userEmail: currentUser.email || undefined,
        targetId: userId,
        targetType: 'USER',
        details: `Username changed from "${currentUser.username || 'null'}" to "${validatedInput.username}"`,
        oldValue: currentUser.username || undefined,
        newValue: validatedInput.username,
        ipAddress: clientIp,
        userAgent: headersList.get('user-agent') || undefined
      });
    }

    // Log other profile updates
    const profileChanges = [];
    if (validatedInput.name && currentUser.name !== validatedInput.name) {
      profileChanges.push(`name: "${currentUser.name || 'null'}" → "${validatedInput.name}"`);
    }
    if (validatedInput.bio !== undefined) {
      profileChanges.push(`bio updated`);
    }
    if (validatedInput.isProfilePublic !== undefined) {
      profileChanges.push(`profile visibility: ${validatedInput.isProfilePublic ? 'public' : 'private'}`);
    }

    if (profileChanges.length > 0) {
      await logUserAction({
        action: USER_ACTIONS.PROFILE_UPDATE,
        userId: userId,
        userEmail: currentUser.email || undefined,
        targetId: userId,
        targetType: 'USER',
        details: `Profile updated: ${profileChanges.join(', ')}`,
        ipAddress: clientIp,
        userAgent: headersList.get('user-agent') || undefined
      });
    }

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