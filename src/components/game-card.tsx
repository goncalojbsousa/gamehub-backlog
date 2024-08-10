import Link from "next/link";
import Image from "next/image";
import { RatingCircle } from "@/src/components/rating-circle";

interface GameCardProps {
    game: Game;
    progress?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, progress }) => {

    return (
        <Link
            href={`/game/${game.slug}`}
            className="flex flex-col items-center  p-2 rounded-lg transition-transform hover:scale-105"
        >
            <Image
                src={`https://${game.cover.url.replace('t_thumb', 't_720p')}`}
                alt={game.name}
                width={200}
                height={300}
                className="rounded-lg w-full h-auto object-cover"
                draggable={false}
            />
            <div className="mt-2 w-full">
                <h3 className="font-semibold text-color_text text-sm truncate">{game.name}</h3>
                <p className="text-xs text-color_text_sec truncate">
                    {game.genres?.map((genre) => genre.name).join(', ')}
                </p>
            </div>
            <div className="flex justify-between items-center w-full mt-2">
                {game.total_rating && <RatingCircle score={Math.round(game.total_rating)} size={40} />}
                {progress && (
                    <div className="text-color_text_sec border border-border_detail px-2 rounded-lg bg-color_sec text-sm">
                        {progress}
                    </div>
                )}
            </div>
        </Link>
    )
};