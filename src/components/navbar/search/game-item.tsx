'use client'

import { categories } from "@/src/constants/categories";
import { convertUnixToDate, getCoverBigUrl } from "@/src/utils/utils";
import Link from "next/link";
import { RatingCircle } from "@/src/components/rating-circle";
import Image from "next/image";

interface GameItemProps {
    game: Game;
}

export const GameItem: React.FC<GameItemProps> = ({ game }) => (
    <div className="flex p-3 rounded-lg hover:bg-color_hover transition-all duration-200">
        <Link href={`/game/${game.slug}`} className="flex w-full items-start gap-3">
            <Image
                src={game.cover ? "https:" + getCoverBigUrl(game.cover.url) : "/cover.webp"}
                width={264}
                height={374}
                alt=""
                className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                draggable="false"
            />
            <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-color_text font-medium text-sm leading-tight truncate">
                        {game.name || 'Unknown Name'}
                    </h3>
                    <span className="text-color_text_sec text-xs px-2 py-1 bg-color_main rounded-full flex-shrink-0">
                        {categories[game.game_type] || 'Unknown Category'}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-color_text_sec truncate">
                        {game.genres?.map((genre) => genre.name).join(', ') || 'Unknown Genre'}
                    </p>
                    <p className="text-xs text-color_text_sec">
                        Released: {convertUnixToDate(game.first_release_date) || 'Unknown Release Date'}
                    </p>
                    <p className="text-xs text-color_text_sec truncate">
                        Platforms: {game.platforms?.map((platform) => platform.name).join(', ') || 'Unknown Platforms'}
                    </p>
                </div>
            </div>
            <div className="flex items-center ml-auto">
                {game.total_rating && <RatingCircle score={Math.round(game.total_rating)} size={40} />}
            </div>
        </Link>
    </div>
);
