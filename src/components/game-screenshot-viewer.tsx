import { getCoverBigUrl, getScreenShotImageUrl } from '@/src/utils/utils';
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
                <div className="mb-4 w-full">
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
                <div className="w-full overflow-x-auto">
                    <div className="flex">
                        {screenshots.map((screenshot, index) => (
                            <div key={index} className="flex-shrink-0 mr-2">
                                <Image
                                    src={"https:" + getCoverBigUrl(screenshot.url)}
                                    width={240}
                                    height={135}
                                    alt="Game screenshot"
                                    className={`w-[120px] h-[67.5px] object-cover cursor-pointer rounded ${selectedScreenshot?.url === screenshot.url ? '' : 'grayscale hover:grayscale-0'}`}
                                    onClick={() => onSelectScreenshot(screenshot)}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default ScreenshotViewer;