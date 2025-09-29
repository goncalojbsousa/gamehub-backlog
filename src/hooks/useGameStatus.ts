import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/src/context/userContext';

interface GameStatusMap {
  [gameId: number]: string;
}

interface UseGameStatusReturn {
  gameStatuses: GameStatusMap;
  updateGameStatus: (gameId: number, status: string) => Promise<void>;
  removeGameStatus: (gameId: number) => Promise<void>;
  isLoading: boolean;
  isUpdating: boolean;
}

// Global cache to avoid multiple API calls for the same data
const globalStatusCache = new Map<number, string>();
const pendingRequests = new Set<string>();

/**
 * Custom hook for managing game statuses efficiently
 * Provides methods to update, remove, and fetch game statuses
 * Uses global cache to avoid duplicate API calls
 * 
 * @param gameIds - Array of game IDs to track
 * @returns Object with game statuses and update methods
 */
export const useGameStatus = (gameIds: number[]): UseGameStatusReturn => {
  const { isAuthenticated } = useUser();
  const [gameStatuses, setGameStatuses] = useState<GameStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const requestIdRef = useRef<string>('');

  // Fetch game statuses for multiple games
  const fetchGameStatuses = useCallback(async (ids: number[]) => {
    if (!isAuthenticated || ids.length === 0) {
      setGameStatuses({});
      return;
    }

    // Check if we already have all the data in cache
    const missingIds = ids.filter(id => !globalStatusCache.has(id));
    
    if (missingIds.length === 0) {
      // All data is in cache, use it
      const cachedStatuses: GameStatusMap = {};
      ids.forEach(id => {
        if (globalStatusCache.has(id)) {
          cachedStatuses[id] = globalStatusCache.get(id)!;
        }
      });
      setGameStatuses(cachedStatuses);
      return;
    }

    // Create a unique request ID to avoid duplicate requests
    const requestId = `status_${missingIds.sort().join('_')}`;
    
    if (pendingRequests.has(requestId)) {
      // Request is already in progress, wait for it
      return;
    }

    pendingRequests.add(requestId);
    requestIdRef.current = requestId;
    setIsLoading(true);

    try {
      const response = await fetch('/api/game/getMultipleGameStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameIds: missingIds }),
      });

      if (response.ok) {
        const data = await response.json();
        const newStatuses = data.statusMap || {};
        
        // Update global cache
        Object.entries(newStatuses).forEach(([gameId, status]) => {
          globalStatusCache.set(Number(gameId), status as string);
        });

        // Update local state with all requested IDs
        const allStatuses: GameStatusMap = {};
        ids.forEach(id => {
          if (globalStatusCache.has(id)) {
            allStatuses[id] = globalStatusCache.get(id)!;
          }
        });
        
        setGameStatuses(allStatuses);
      }
    } catch (error) {
      console.error('Error fetching game statuses:', error);
    } finally {
      pendingRequests.delete(requestId);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Update game status
  const updateGameStatus = useCallback(async (gameId: number, status: string) => {
    if (!isAuthenticated) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/game/updateGameStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId, status }),
      });

      if (response.ok) {
        // Update global cache
        globalStatusCache.set(gameId, status);
        
        setGameStatuses(prev => ({
          ...prev,
          [gameId]: status
        }));
      }
    } catch (error) {
      console.error('Error updating game status:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // Remove game status
  const removeGameStatus = useCallback(async (gameId: number) => {
    if (!isAuthenticated) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/game/removeGameStatus', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      });

      if (response.ok) {
        // Remove from global cache
        globalStatusCache.delete(gameId);
        
        setGameStatuses(prev => {
          const newStatuses = { ...prev };
          delete newStatuses[gameId];
          return newStatuses;
        });
      }
    } catch (error) {
      console.error('Error removing game status:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  // Fetch statuses when gameIds change
  useEffect(() => {
    if (gameIds.length > 0) {
      fetchGameStatuses(gameIds);
    }
  }, [gameIds, fetchGameStatuses]);

  return {
    gameStatuses,
    updateGameStatus,
    removeGameStatus,
    isLoading,
    isUpdating
  };
};
