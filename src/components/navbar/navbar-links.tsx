'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/src/components/svg/logo";
import { MenuOpen } from "@/src/components/svg/menu/menu-open";
import { MenuClose } from "@/src/components/svg/menu/menu-close";
import { HomeIcon } from "@/src/components/svg/navigation/home-icon";
import { SearchIcon } from "@/src/components/svg/search-icon";


export const NavbarLinks = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuIconRef = useRef<HTMLImageElement>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            menuIconRef.current &&
            !menuIconRef.current.contains(event.target as Node)
        ) {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);
    
    return (
        <>
            <div className="hidden md:flex items-center gap-8">
                <Link href="/" aria-label="Go to home page" className="transition-transform duration-200 hover:scale-105">
                    <Logo className="fill-color_icons" width="2.5em" height="2.5em"/> 
                </Link>

                <Link 
                    href="/" 
                    className="text-color_text text-base font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-color_hover hover:text-color_text hover:shadow-md select-none"
                >
                    Home
                </Link>

            </div>

            {/* MENU BUTTON */}
            <div className="md:hidden flex items-center" ref={menuIconRef}>
                <button
                    className="text-color_text p-2 rounded-lg transition-all duration-200 hover:bg-color_hover focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? (
                        <MenuOpen className="fill-color_icons w-6 h-6" />
                    ) : (
                        <MenuClose className="fill-color_icons w-6 h-6" />
                    )}
                </button>
            </div>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-color_sec shadow-xl border-b border-border_detail z-50" ref={menuRef}>
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Link 
                                href="/" 
                                onClick={toggleMobileMenu} 
                                className="flex items-center px-4 py-3 text-color_text hover:bg-color_hover rounded-lg transition-all duration-200 select-none font-medium"
                            >
                                <HomeIcon className="mr-3 fill-color_icons w-5 h-5"/>
                                Home
                            </Link>
                            <Link 
                                href="/search" 
                                onClick={toggleMobileMenu} 
                                className="flex items-center px-4 py-3 text-color_text hover:bg-color_hover rounded-lg transition-all duration-200 select-none font-medium"
                            >
                                <SearchIcon className="mr-3 fill-color_icons w-5 h-5" />
                                Search
                            </Link>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}