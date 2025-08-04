'use server'

import { NextResponse } from 'next/server';
import { updateSession } from '@/src/lib/auth/updateSessionServerAction';

export async function POST() {
  try {
    const success = await updateSession();
    
    if (success) {
      return NextResponse.json({ 
        message: 'Session updated successfully' 
      });
    } else {
      return NextResponse.json({ 
        message: 'Failed to update session' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
} 