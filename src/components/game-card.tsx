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
            className="flex flex-col items-center p-2 rounded-lg transition-transform hover:scale-105"
        >
            <div className="relative w-full">
                {progress && (
                    <div className="absolute top-2 left-2 text-color_text_sec border border-border_detail px-2 rounded-lg bg-color_sec text-sm">
                        {progress}
                    </div>
                )}
                <Image
                    src={"https:" + getCoverImageUrl(game.cover.url)}
                    alt="Game cover image"
                    width={200}
                    height={300}
                    className="rounded-lg w-full h-auto object-cover shadow-lg"
                    draggable={false}
                />
            </div>
            <div className="mt-2 w-full">
                <h3 className="font-semibold text-color_text text-sm truncate">{game.name}</h3>
                <p className="text-xs text-color_text_sec truncate">
                    {game.genres?.map((genre) => genre.name).join(', ')}
                </p>
            </div>
            <div className="flex justify-between items-center w-full mt-2">
                {game.total_rating && <RatingCircle score={Math.round(game.total_rating)} size={40} />}

                {game.price &&
                    <div className="bg-color_reverse_sec px-2 py-1.5 rounded-lg">
                        <p className="text-md text-color_main">
                            <b>{game.price}$</b>
                        </p>
                    </div>
                }
            </div>

        </Link>
    )
};
