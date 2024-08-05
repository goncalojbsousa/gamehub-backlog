'use client'

import { Footer } from "@/src/components/footer";
import { GameInfo } from "@/src/components/game-info";
import { GamePageContent } from "@/src/components/game-page-content";
import ScreenshotViewer from "@/src/components/game-screenshot-viewer";
import { ModalContent } from "@/src/components/modal-content";
import { Navbar } from "@/src/components/navbar/navbar";
import { categories } from "@/src/constants/categories";
import { getScreenShotImageUrl } from "@/src/utils/utils";
import { useState } from "react";

interface GamePageProps {
    game: Game;
}

export const GamePage: React.FC<GamePageProps> = ({ game }) => {
    const [selectedScreenshot, setSelectedScreenshot] = useState(game.screenshots[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedProgress, setSelectedProgress] = useState('');

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
    };

    const handleProgressClick = (progress: string) => {
        setSelectedProgress(progress);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const mainStyle = selectedScreenshot ? {
        backgroundImage: `
            linear-gradient(to bottom, var(--gradient-start), var(--gradient-end)),
            url(${getScreenShotImageUrl(selectedScreenshot.url)})
        `,
        backgroundSize: '100% 1200px',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--background)',
    } : {};

    return (
        <main className="transition-colors duration-200 pt-16 relative min-h-screen" style={mainStyle}>
            <Navbar />
            <div className="relative z-10">
                <div className="flex mt-2 items-center justify-between xl:px-24">
                    <div className="flex items-center p-3">
                        <h1 className="text-color_text text-2xl shadow-sm">{game.name}</h1>
                        {/*game.version_title &&
                            <p className="text-color_text_sec text-lg ml-2 hidden md:flex shadow-sm">{"(" + game.version_title + ")"}</p>
                        */}

                        <p className="text-color_text_sec text-lg ml-2 hidden md:flex shadow-sm"> | {categories[game.category] || 'Unknown Category'}</p>
                    </div>

                    <div className="flex">
                        <button
                            className="mr-4 text-color_main bg-color_reverse_sec rounded-lg px-4 py-2 hover:bg-color_reverse transition-colors duration-200"
                            onClick={openModal}
                        >
                            + Add to List
                        </button>
                    </div>
                </div>


                <div className="p-3 xl:px-24 text-color_text">
                    <div className="flex flex-col md:flex-row">

                        <GameInfo game={game} />

                        <div className="w-full md:w-2/2 px-2 flex flex-col justify-start items-center">
                            <ScreenshotViewer
                                screenshots={game.screenshots}
                                selectedScreenshot={selectedScreenshot}
                                onSelectScreenshot={setSelectedScreenshot}
                            />

                            <GamePageContent game={game} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <Footer />
            </div>

            <ModalContent
                selectedOption={selectedOption}
                handleOptionClick={handleOptionClick}
                selectedProgress={selectedProgress}
                handleProgressClick={handleProgressClick}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                gameId={game.id}
            />

        </main>
    );
}