'use server'

import { pool } from "@/src/lib/postgres";
import { getUserId } from "@/src/lib/auth/getUserIdServerAction";

export async function fetchUserGameStatus(gameId: string) {
  const query = `
    SELECT status, progress 
    FROM user_game_status 
    WHERE user_id = $1 AND game_id = $2
  `;

  try {
    const userId = await getUserId();
    const result = await pool.query(query, [userId, gameId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user game status:', error);
    throw error;
  }
}