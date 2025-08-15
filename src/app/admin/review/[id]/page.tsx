'use server'

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { fetchGameDetailsByIds } from '@/src/services/igdbServices/getGameByIds';

interface Props {
  params: Promise<{ id: string }>
}

const prisma = new PrismaClient();

export default async function AdminReviewRedirect({ params }: Props) {
  const { id } = await params;
  const reviewId = Number(id);
  if (!reviewId || Number.isNaN(reviewId)) {
    redirect('/admin');
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    redirect('/admin');
  }

  const gameId = review.gameId;
  const gameData = await fetchGameDetailsByIds([gameId]);
  const slug = gameData?.[0]?.slug;

  if (!slug) {
    // Fallback: go to admin if slug cannot be resolved
    redirect('/admin');
  }

  // Deep link to the specific review using a hash anchor
  redirect(`/game/${slug}#review-${reviewId}`);
}
