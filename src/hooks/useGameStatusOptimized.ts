import { useEffect } from 'react';
import { useGameStatusContext } from '@/src/context/gameStatusContext';

interface UseGameStatusReturn {
  gameStatuses: { [gameId: number]: string };
  updateGameStatus: (gameId: number, status: string) => Promise<void>;
  removeGameStatus: (gameId: number) => Promise<void>;
  isLoading: boolean;
  isUpdating: boolean;
}

/**
 * Optimized hook for managing game statuses
 * Uses global context to avoid duplicate API calls
 * 
 * @param gameIds - Array of game IDs to track
 * @returns Object with game statuses and update methods
 */
export const useGameStatusOptimized = (gameIds: number[]): UseGameStatusReturn => {
  const { gameStatuses, updateGameStatus, removeGameStatus, isLoading, isUpdating, fetchGameStatuses } = useGameStatusContext();

  // Fetch statuses for the requested game IDs
  useEffect(() => {
    if (gameIds.length > 0) {
      fetchGameStatuses(gameIds);
    }
  }, [gameIds, fetchGameStatuses]);

  // Return only the statuses for the requested game IDs
  const filteredStatuses = gameIds.reduce((acc, gameId) => {
    if (gameStatuses[gameId]) {
      acc[gameId] = gameStatuses[gameId];
    }
    return acc;
  }, {} as { [gameId: number]: string });

  return {
    gameStatuses: filteredStatuses,
    updateGameStatus,
    removeGameStatus,
    isLoading,
    isUpdating
  };
};
