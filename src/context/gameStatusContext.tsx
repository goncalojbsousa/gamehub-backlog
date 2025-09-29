'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@/src/context/userContext';

interface GameStatusMap {
  [gameId: number]: string;
}

interface GameStatusContextType {
  gameStatuses: GameStatusMap;
  updateGameStatus: (gameId: number, status: string) => Promise<void>;
  removeGameStatus: (gameId: number) => Promise<void>;
  isLoading: boolean;
  isUpdating: boolean;
  fetchGameStatuses: (gameIds: number[]) => Promise<void>;
}

const GameStatusContext = createContext<GameStatusContextType | undefined>(undefined);

export const useGameStatusContext = () => {
  const context = useContext(GameStatusContext);
  if (!context) {
    throw new Error('useGameStatusContext must be used within a GameStatusProvider');
  }
  return context;
};

interface GameStatusProviderProps {
  children: React.ReactNode;
}

export const GameStatusProvider: React.FC<GameStatusProviderProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [gameStatuses, setGameStatuses] = useState<GameStatusMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchedGameIds, setFetchedGameIds] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch game statuses for multiple games
  const fetchGameStatuses = useCallback(async (gameIds: number[]) => {
    if (!isAuthenticated || gameIds.length === 0) {
      return;
    }

    // Filter out already fetched game IDs
    const newGameIds = gameIds.filter(id => !fetchedGameIds.has(id));
    
    if (newGameIds.length === 0) {
      // All requested games are already fetched
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/game/getMultipleGameStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameIds: newGameIds }),
      });

      if (response.ok) {
        const data = await response.json();
        const newStatuses = data.statusMap || {};
        
        // Update state with new statuses
        setGameStatuses(prev => ({
          ...prev,
          ...newStatuses
        }));

        // Mark these game IDs as fetched
        setFetchedGameIds(prev => {
          const newSet = new Set(prev);
          newGameIds.forEach(id => newSet.add(id));
          return newSet;
        });
      } else {
        console.error('Failed to fetch game statuses:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching game statuses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchedGameIds]);

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

  const value: GameStatusContextType = {
    gameStatuses,
    updateGameStatus,
    removeGameStatus,
    isLoading,
    isUpdating,
    fetchGameStatuses
  };

  return (
    <GameStatusContext.Provider value={value}>
      {children}
    </GameStatusContext.Provider>
  );
};
