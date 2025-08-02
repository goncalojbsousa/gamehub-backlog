'use client'

import { Footer } from "@/src/components/footer";
import { GameInfo } from "@/src/components/game-info";
import { GamePageContent } from "@/src/components/game-page-content";
import ScreenshotViewer from "@/src/components/game-screenshot-viewer";
import { ModalContent } from "@/src/components/modal-content";
import { Navbar } from "@/src/components/navbar/navbar";
import { ProgressIcon } from "@/src/components/svg/progress";
import { StatusIcon } from "@/src/components/svg/status";
import { ShareButtons } from "@/src/components/share-buttons";
import { categories } from "@/src/constants/categories";
import { getScreenShotImageUrl } from "@/src/utils/utils";
import { useState } from "react";

interface GamePageProps {
    game: Game;
    userGameStatus: UserGameStatus | null;
}

export const GamePage: React.FC<GamePageProps> = ({ game, userGameStatus }) => {
    const [selectedScreenshot, setSelectedScreenshot] = useState(game.screenshots?.[0] || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(userGameStatus?.status || '');
    const [selectedProgress, setSelectedProgress] = useState(userGameStatus?.progress || '');

    const [currentOption, setCurrentOption] = useState(userGameStatus?.status || '');
    const [currentProgress, setCurrentProgress] = useState(userGameStatus?.progress || '');

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
            linear-gradient(to bottom, var(--gradient-start), var(--background)),
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
                {/* Hero Section */}
                <div className="relative bg-gradient-to-b from-black/20 to-transparent">
                    <div className="container mx-auto px-4 lg:px-8 py-4">
                        {/* Game Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-color_text leading-tight">
                                        {game.name}
                                    </h1>
                                    {game.version_title && (
                                        <span className="text-color_text_sec text-lg hidden md:inline">
                                            ({game.version_title})
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="px-3 py-1 bg-color_reverse_sec text-color_main rounded-full font-medium">
                                        {categories[game.category] || 'Unknown Category'}
                                    </span>
                                    {game.first_release_date && (
                                        <span className="text-color_text_sec">
                                            Released {new Date(game.first_release_date * 1000).getFullYear()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons and Share */}
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {currentOption && currentProgress && (
                                        <div className="hidden lg:flex gap-3">
                                            <div className="flex items-center px-4 py-2 rounded-lg border border-border_detail bg-color_sec hover:bg-color_hover transition-colors">
                                                <StatusIcon className='fill-color_icons mr-2 w-4 h-4' />
                                                <span className="text-color_text text-sm font-medium">{currentOption}</span>
                                            </div>
                                            <div className="flex items-center px-4 py-2 rounded-lg border border-border_detail bg-color_sec hover:bg-color_hover transition-colors">
                                                <ProgressIcon className='fill-color_icons mr-2 w-4 h-4' />
                                                <span className="text-color_text text-sm font-medium">{currentProgress}</span>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        className="px-6 py-3 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        onClick={openModal}
                                    >
                                        {currentOption && currentProgress ? "Update Status" : "Add to List"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Game Info Sidebar */}
                        <div className="lg:col-span-1">
                            <GameInfo game={game} />
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Screenshots Section */}
                            {selectedScreenshot && (
                                <div className="mb-8">
                                    <ScreenshotViewer
                                        screenshots={game.screenshots}
                                        selectedScreenshot={selectedScreenshot}
                                        onSelectScreenshot={setSelectedScreenshot}
                                    />
                                </div>
                            )}
                            
                            {/* Game Content */}
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
                setCurrentOption={setCurrentOption}
                setCurrentProgress={setCurrentProgress}
            />
        </main>
    );
}