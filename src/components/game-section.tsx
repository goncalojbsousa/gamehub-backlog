import React from 'react';
import { TrendingIcon } from '@/src/components/svg/trending';
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
      <div className="bg-color_main p-6 rounded-lg mb-6 flex items-center relative overflow-hidden">
        <div className="mr-4 z-10">
          <TrendingIcon className="fill-color_icons" />
        </div>
        <h2 className="text-3xl font-bold z-10">{title}</h2>
        {games.length > 0 && (
          <div className="absolute top-0 right-0 w-8/12 h-full">
            <div
              className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-lg opacity-100"
              style={{
                backgroundImage: `url(${coverImageUrl})`,
              }}
            ></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))
        ) : (
          <div className="flex justify-center w-full">
            <LoadingIcon className="fill-color_icons" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSection;
