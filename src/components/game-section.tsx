import React from 'react';
import { GameCard } from '@/src/components/game-card';
import { GameCardSkeleton } from '@/src/components/skeleton';
import { useGameStatusOptimized } from '@/src/hooks/useGameStatusOptimized';

interface GameSectionProps {
  title: string;
  games: Game[];
  coverImageUrl: string;
  className?: string;
  isLoading?: boolean;
}

const GameSection: React.FC<GameSectionProps> = ({ title, games, coverImageUrl, className, isLoading = false }) => {
  // Get game IDs for status tracking
  const gameIds = games.map(game => game.id);
  
  // Use the optimized game status hook
  const { gameStatuses } = useGameStatusOptimized(gameIds);

  return (
    <div className={className}>
      {/* Modern Section Header */}
      <div className="relative mb-8">
        <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail relative overflow-hidden">
          {/* Background Image Overlay */}
          {games.length > 0 && !isLoading && (
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div
                className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-xl"
                style={{
                  backgroundImage: `url(${coverImageUrl})`,
                }}
              ></div>
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-color_text">
              {title}
            </h2>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {isLoading ? (
          // Show skeleton cards when loading
          Array.from({ length: 6 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))
        ) : games.length > 0 ? (
          games.map((game) => {
            const userGameStatus = gameStatuses[game.id] ? { status: gameStatuses[game.id] } : null;
            return (
              <GameCard 
                key={game.id} 
                game={game} 
                userGameStatus={userGameStatus}
              />
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-4">
              <p className="text-color_text_sec">No games found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSection;
