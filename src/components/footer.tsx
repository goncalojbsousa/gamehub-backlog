import Link from "next/link"
import { LinkedinIcon } from "./svg/social/linkedin-icon"
import { GithubIcon } from "./svg/social/github-icon"
import Image from "next/image";
import { WebsiteIcon } from "./svg/social/website-icon";
import { IGDBIcon } from "./svg/igdb";

export const Footer = () => {
    return (
        <footer className="bg-color_main p-6 flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl w-full">

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">EXPLORE</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <Link className="hover:underline" href="/">Home</Link>
                        <Link className="hover:underline" href="/search">Search</Link>
                    </ul>
                </div>

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">GAME HUB</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <Link className="hover:underline" href="/about">About Us</Link>

                    </ul>
                </div>

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">LEGAL</h3>
                    <ul className="text-color_text_sec flex flex-col">
                        <Link className="hover:underline" href="/terms">Terms of Service</Link>
                        <Link className="hover:underline" href="/privacy">Privacy Policy</Link>
                    </ul>
                </div>

                <div className="">
                    <h3 className="text-lg text-color_text font-semibold mb-2">DEVELOPED BY</h3>
                    <div className="flex itens-center">
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
                                <Link href="https://goncalosousa.netlify.app" target="_blank">
                                    <WebsiteIcon className="fill-color_icons" />
                                </Link>
                                <Link href="https://github.com/goncalojbsousa" target="_blank">
                                    <GithubIcon className="fill-color_icons" />
                                </Link>
                                <Link href="https://www.linkedin.com/in/goncalojbsousa/" target="_blank">
                                    <LinkedinIcon className="fill-color_icons" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <Link href="https://www.igdb.com" target="_blank" className="flex hover:underline items-center">
                    <p className="text-color_text mr-2">Games data is powered by</p>
                    <IGDBIcon className="fill-color_icons" />
                </Link>

            </div>
        </footer>
    )
}
