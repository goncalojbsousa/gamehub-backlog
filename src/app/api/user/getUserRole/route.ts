'use server';

import { NextResponse } from 'next/server';
import { getUserRole } from '@/src/lib/auth/getUserRoleServerAction';

export async function GET() {
  try {
    const role = await getUserRole();
    
    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ role }, { status: 200 });
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 