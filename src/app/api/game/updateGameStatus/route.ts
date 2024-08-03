import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/postgres';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const inputSchema = z.object({
  userId: z.string().uuid(),
  gameId: z.number().positive(),
  status: z.string().max(20),
  progress: z.string().max(20)
});

export async function POST(request: Request) {

  // CHECK IS AUTHENTICATED
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in")
  }

  // GET CLIENT IP
  const headersList = headers();
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
  const body = await request.json();
  const validatedInput = inputSchema.parse(body);


  const userId = await getUserId();
  if (userId === undefined) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (validatedInput.userId !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO user_game_status (user_id, game_id, status, progress)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, game_id) DO UPDATE
         SET status = $3, progress = $4, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [validatedInput.userId, validatedInput.gameId, validatedInput.status, validatedInput.progress]
      );

      await client.query('COMMIT');

      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating game status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}