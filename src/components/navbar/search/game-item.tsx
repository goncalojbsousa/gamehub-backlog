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
    <div key={game.id} className="flex p-2 rounded-md hover:bg-color_main">
        <Link href={`/game/${game.slug}`} className="flex w-full">
            <Image
                src={"https:" + getCoverBigUrl(game.cover.url)}
                width={264}
                height={374}
                alt=""
                className="w-20 rounded-md"
                draggable="false"
            />
            <div className="flex flex-col space-x-2 flex-grow">
                <div className="flex space-x-1">
                    <p className="ml-2">{game.name || 'Unknown Name'}</p>
                    <p className="text-color_text_sec"> | {categories[game.category] || 'Unknown Category'}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-s text-color_text_sec mt-1 mb-2">
                        {game.genres?.map((genre) => genre.name).join(', ') || 'Unknown Genre'}
                    </p>
                    <p className="text-xs text-color_text_sec mb-2">Released: {convertUnixToDate(game.first_release_date) || 'Unknown Release Date'}</p>
                    <p className="text-xs text-color_text_sec mb-2">Platforms: {game.platforms?.map((platform) => platform.name).join(', ') || 'Unknown Platforms'}</p>
                </div>
            </div>
            <div className="flex items-center ml-auto mr-6">
                {game.total_rating && <RatingCircle score={Math.round(game.total_rating)} size={45} />}
            </div>
        </Link>
    </div>
);
