import Link from "next/link";
import Image from "next/image";
import { RatingCircle } from "@/src/components/rating-circle";
import { getCoverImageUrl } from "@/src/utils/utils";

interface GameCardProps {
    game: Game;
    progress?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, progress }) => {

    return (
        <Link
            href={`/game/${game.slug}`}
            className="group block bg-color_sec rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
        >
            <div className="relative">
                {progress && (
                    <div className="absolute top-2 left-2 z-10 text-color_text_sec border border-border_detail px-2 py-1 rounded-lg bg-color_sec text-xs font-medium shadow-sm">
                        {progress}
                    </div>
                )}
                <div className="aspect-[3/4] overflow-hidden">
                    <Image
                        src={game.cover ? "https:" + getCoverImageUrl(game.cover.url) : "/cover.webp"}
                        alt={`${game.name} cover image`}
                        width={200}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        draggable={false}
                    />
                </div>
            </div>
            
            <div className="p-3">
                <h3 className="font-semibold text-color_text text-sm mb-1 group-hover:text-color_reverse_sec transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
                    {game.name}
                </h3>
                
                {game.genres && game.genres.length > 0 && (
                    <p className="text-xs text-color_text_sec mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {game.genres.slice(0, 2).map(genre => genre.name).join(', ')}
                        {game.genres.length > 2 && '...'}
                    </p>
                )}
                
                <div className="flex justify-between items-center">
                    {game.total_rating && (
                        <RatingCircle score={Math.round(game.total_rating)} size={32} />
                    )}
                    
                    {game.price && (
                        <div className="bg-color_reverse_sec px-2 py-1 rounded-lg">
                            <span className="text-xs text-color_main font-bold">
                                ${game.price}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
};
