'use client'

import { GameItem } from "@/src/components/navbar/search/game-item";

interface SearchResultsProps {
  games: Game[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ games }) => (
  <div className="flex flex-col p-2 pb-0">
    {games.map(game => <GameItem key={game.id} game={game} />)}
  </div>
);