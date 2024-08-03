import { getScreenShotImageUrl } from '@/src/utils/utils';

interface Screenshot {
    url: string;
}

interface ScreenshotViewerProps {
    screenshots: Screenshot[];
    selectedScreenshot: Screenshot;
    onSelectScreenshot: (screenshot: Screenshot) => void;
}

const ScreenshotViewer: React.FC<ScreenshotViewerProps> = ({ screenshots, selectedScreenshot, onSelectScreenshot }) => {
    return (
        <div className="w-full md:w-2/2 px-2 flex flex-col justify-start items-center">
            {selectedScreenshot &&
                <div className="mb-4">
                    <img
                        src={getScreenShotImageUrl(selectedScreenshot.url)}
                        alt=""
                        className="w-full rounded-lg"
                        draggable={false}
                    />
                </div>
            }

            {screenshots &&
                <div className="flex overflow-x-auto">
                    {screenshots.map((screenshot, index) => (
                        <img
                            key={index}
                            src={getScreenShotImageUrl(screenshot.url)}
                            alt="Game screenshot"
                            className="w-20 object-cover mr-2 cursor-pointer rounded"
                            onClick={() => onSelectScreenshot(screenshot)}
                            draggable={false}
                        />
                    ))}
                </div>
            }
        </div>
    );
};

export default ScreenshotViewer;
