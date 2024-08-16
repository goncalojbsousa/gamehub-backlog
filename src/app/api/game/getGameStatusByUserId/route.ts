'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const domain = process.env.NEXTAUTH_URL;
        const url = `${domain}/api/game/getAllGameStatusByUserId?userId=${userId}`;

        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`Failed to fetch games: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in getAllGameStatusByUserId:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}
