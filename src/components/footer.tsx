import Link from "next/link";
import { IGDBIcon } from "@/src/components/svg/igdb";

export const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-b from-color_sec to-color_main border-t border-border_detail">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
            </div>

            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-color_text mb-4">Navigation</h3>
                        <div className="space-y-2">
                            <Link 
                                href="/" 
                                className="block text-color_text_sec hover:text-color_text transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/search" 
                                className="block text-color_text_sec hover:text-color_text transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                Search Games
                            </Link>
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-color_text mb-4">Legal</h3>
                        <div className="space-y-2">
                            <Link 
                                href="/terms" 
                                className="block text-color_text_sec hover:text-color_text transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                href="/privacy" 
                                className="block text-color_text_sec hover:text-color_text transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-color_text mb-4">About</h3>
                        <div className="space-y-2">
                            <Link 
                                href="/about" 
                                className="block text-color_text_sec hover:text-color_text transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                About GameHub
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-border_detail">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="text-color_text_sec text-sm">
                            © 2025 GameHub. All rights reserved.
                        </div>

                        {/* IGDB Attribution */}
                        <Link 
                            href="https://www.igdb.com" 
                            target="_blank" 
                            className="flex items-center gap-2 text-color_text_sec hover:text-color_text transition-colors duration-200 group"
                        >
                            <span className="text-sm">Games data is powered by</span>
                            <IGDBIcon className="fill-current w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
