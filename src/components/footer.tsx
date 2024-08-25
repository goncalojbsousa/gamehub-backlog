import Link from "next/link";
import { LinkedinIcon } from "@/src/components/svg/social/linkedin-icon";
import { GithubIcon } from "@/src/components/svg/social/github-icon";
import Image from "next/image";
import { WebsiteIcon } from "@/src/components/svg/social/website-icon";
import { IGDBIcon } from "@/src/components/svg/igdb";

export const Footer = () => {
    return (
        <footer className="bg-color_main p-6 flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">EXPLORE</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <li>
                            <Link className="hover:underline" href="/">Home</Link>
                        </li>
                        <li>
                            <Link className="hover:underline" href="/search">Search</Link>
                        </li>
                    </ul>
                </div>

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">GAME HUB</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <li>
                            <Link className="hover:underline" href="/about">About Us</Link>
                        </li>
                    </ul>
                </div>

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">LEGAL</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <li>
                            <Link className="hover:underline" href="/terms">Terms of Service</Link>
                        </li>
                        <li>
                            <Link className="hover:underline" href="/privacy">Privacy Policy</Link>
                        </li>
                    </ul>
                </div>
                {/*
                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">DEVELOPED BY</h3>
                    <div className="flex items-center">
                        <Image
                            src="/gjbs.jpeg"
                            alt="User profile image"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full mr-3"
                            draggable={false}
                        />
                        <div>
                            <div className="text-color_text_sec flex flex-col">
                                Gonçalo Sousa
                            </div>
                            <div className="flex">
                                <Link href="https://goncalosousa.netlify.app"
                                    target="_blank"
                                    aria-label="Go to Gonçalo Sousa website"
                                >
                                    <WebsiteIcon className="fill-color_icons" />
                                </Link>
                                <Link href="https://github.com/goncalojbsousa"
                                    target="_blank"
                                    aria-label="Go to Gonçalo Sousa github"
                                >
                                    <GithubIcon className="fill-color_icons" />
                                </Link>
                                <Link href="https://www.linkedin.com/in/goncalojbsousa/"
                                    target="_blank"
                                    aria-label="Go to Gonçalo Sousa linkedin"
                                >
                                    <LinkedinIcon className="fill-color_icons" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                */}
            </div>
            <div className="mt-6">
                <Link href="https://www.igdb.com" target="_blank" className="flex hover:underline items-center">
                    <p className="text-color_text mr-2">Games data is powered by</p>
                    <IGDBIcon className="fill-color_icons" />
                </Link>
            </div>
        </footer>
    );
};
