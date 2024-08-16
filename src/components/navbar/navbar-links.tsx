'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/src/components/svg/logo";
import { MenuOpen } from "@/src/components/svg/menu/menu-open";
import { MenuClose } from "@/src/components/svg/menu/menu-close";
import { HomeIcon } from "@/src/components/svg/navigation/home-icon";
import { SearchIcon } from "../svg/search-icon";

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
            <div className="hidden md:flex items-center">
                <Link href="/" ><Logo className="fill-color_icons mr-8" /> </Link>

                <Link href="/" className="text-color_text text-base mr-4 select-none">Home</Link>
            </div>

            {/* MENU BUTTON */}
            <div className="md:hidden flex items-center" ref={menuIconRef}>
                <button
                    className="text-color_text text-md focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? (
                        <MenuOpen className="fill-color_icons" />
                    ) : (
                        <MenuClose className="fill-color_icons" />
                    )
                    }
                </button>
            </div>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute mt-36 bg-color_sec shadow-md border border-border_detail rounded-md w-48 p-2" ref={menuRef}>
                    <div className="flex flex-col">
                        <Link href="/" onClick={toggleMobileMenu} className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200 select-none">
                            <HomeIcon className="mr-2 mt-1 fill-color_icons"/>
                            Home
                        </Link>
                        <Link href="/search" onClick={toggleMobileMenu} className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200 select-none">
                            <SearchIcon className="mr-2 mt-1 fill-color_icons" />
                            Search
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}