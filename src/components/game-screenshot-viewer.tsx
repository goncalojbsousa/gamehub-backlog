import { getCoverBigUrl, getScreenShotImageUrl } from '@/src/utils/utils';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface Screenshot {
    url: string;
}

interface ScreenshotViewerProps {
    screenshots: Screenshot[];
    selectedScreenshot: Screenshot;
    onSelectScreenshot: (screenshot: Screenshot) => void;
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ screenshots, selectedScreenshot, onSelectScreenshot }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // Responsive thumbnails per page
    const thumbnailsPerPage = isMobile ? 4 : 8;
    const totalPages = Math.ceil(screenshots.length / thumbnailsPerPage);
    
    const canGoLeft = currentPage > 0;
    const canGoRight = currentPage < totalPages - 1;

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollLeft = () => {
        if (canGoLeft) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const scrollRight = () => {
        if (canGoRight) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Reset to first page when screenshots change or screen size changes
    useEffect(() => {
        setCurrentPage(0);
    }, [screenshots, thumbnailsPerPage]);

    // Get current page thumbnails
    const startIndex = currentPage * thumbnailsPerPage;
    const endIndex = startIndex + thumbnailsPerPage;
    const currentThumbnails = screenshots.slice(startIndex, endIndex);

    return (
        <div className="w-full bg-color_sec rounded-xl overflow-hidden shadow-lg">
            {/* Main Screenshot */}
            {selectedScreenshot && (
                <div className="relative">
                    <Image
                        src={"https:" + getScreenShotImageUrl(selectedScreenshot.url)}
                        alt="Game screenshot"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                        draggable={false}
                    />
                    
                    {/* Gradient overlay at bottom for smooth transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-color_sec to-transparent"></div>
                </div>
            )}

            {/* Thumbnails - Integrated with main image */}
            {screenshots && screenshots.length > 1 && (
                <div className="py-2 sm:py-3">
                    {/* Navigation Container */}
                    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
                        {/* Left Button - Always visible */}
                        <button
                            onClick={scrollLeft}
                            disabled={!canGoLeft}
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                                canGoLeft 
                                    ? 'bg-color_reverse_sec hover:bg-color_reverse text-color_main cursor-pointer' 
                                    : 'bg-color_main text-color_text_sec cursor-not-allowed opacity-50'
                            }`}
                            aria-label="Previous screenshots"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Thumbnails Container - Responsive */}
                        <div className="flex gap-1.5 sm:gap-2 flex-1 justify-center">
                            {currentThumbnails.map((screenshot, index) => {
                                const actualIndex = startIndex + index;
                                return (
                                    <div 
                                        key={actualIndex} 
                                        className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                                            selectedScreenshot?.url === screenshot.url 
                                                ? 'scale-105' 
                                                : 'hover:scale-105'
                                        }`}
                                        onClick={() => onSelectScreenshot(screenshot)}
                                    >
                                        <div className={`relative rounded-md overflow-hidden ${
                                            selectedScreenshot?.url === screenshot.url 
                                                ? 'border-2 border-color_reverse_sec shadow-lg' 
                                                : 'border border-border_detail'
                                        }`}>
                                            <Image
                                                src={"https:" + getCoverBigUrl(screenshot.url)}
                                                width={120}
                                                height={67.5}
                                                alt={`Game screenshot ${actualIndex + 1}`}
                                                className={`w-16 h-9 sm:w-20 sm:h-11 object-cover transition-all duration-200 ${
                                                    selectedScreenshot?.url === screenshot.url 
                                                        ? 'brightness-100 opacity-100' 
                                                        : 'brightness-75 opacity-80 hover:brightness-100 hover:opacity-100'
                                                }`}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Button - Always visible */}
                        <button
                            onClick={scrollRight}
                            disabled={!canGoRight}
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                                canGoRight 
                                    ? 'bg-color_reverse_sec hover:bg-color_reverse text-color_main cursor-pointer' 
                                    : 'bg-color_main text-color_text_sec cursor-not-allowed opacity-50'
                            }`}
                            aria-label="Next screenshots"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScreenshotViewer;