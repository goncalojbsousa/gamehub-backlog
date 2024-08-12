'use server'

export async function getGameStatusByUserId(userId: string, status: string, page: number) {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/game/getGameStatusByUserId?userId=${userId}&status=${status}&page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    return response.json();
  }