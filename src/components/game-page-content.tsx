interface GameInfoProps {
    game: Game;
}

export const GamePageContent: React.FC<GameInfoProps> = ({ game }) => {
    return (
        <div>
            {(game.summary || game.storyline) &&
                <hr className="mt-6 mb-6 border-border_detail" />
            }

            {game.summary &&
                <>
                    <h1 className="text-color_text text-2xl">Summary</h1>
                    <p className="text-color_text_sec text-lg">{game.summary}</p>
                </>
            }
            {game.storyline &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">History</h1>
                    <p className="text-color_text_sec text-lg">{game.storyline}</p>
                </>
            }
        </div>
    )
}