import { getScreenShotImageUrl } from '@/src/utils/utils';
import Image from 'next/image';

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
                    <Image
                        src={"https:" + getScreenShotImageUrl(selectedScreenshot.url)}
                        alt=""
                        width={1920}
                        height={1080}
                        className="w-full rounded-lg"
                        draggable={false}
                    />
                </div>
            }

            {screenshots &&
                <div className="flex overflow-x-auto">
                    {screenshots.map((screenshot, index) => (
                        <Image
                            key={index}
                            src={"https:" + screenshot.url}
                            width={240}
                            height={135}
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
