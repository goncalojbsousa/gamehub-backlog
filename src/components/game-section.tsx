import React from 'react';
import { GameCard } from '@/src/components/game-card';
import { LoadingIcon } from '@/src/components/svg/loading';

interface GameSectionProps {
  title: string;
  games: Game[];
  coverImageUrl: string;
  className?: string;
}

const GameSection: React.FC<GameSectionProps> = ({ title, games, coverImageUrl, className }) => {
  return (
    <div className={className}>
      {/* Modern Section Header */}
      <div className="relative mb-8">
        <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail relative overflow-hidden">
          {/* Background Image Overlay */}
          {games.length > 0 && (
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
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-4">
              <LoadingIcon className="fill-color_icons w-12 h-12 animate-spin" />
              <p className="text-color_text_sec">Loading games...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSection;
