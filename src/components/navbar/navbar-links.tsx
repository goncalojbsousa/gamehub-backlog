'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-color_icons mr-6" width="3em" height="3em" viewBox="0 0 24 24">
                    <path  d="M6 15h2.4q.475 0 .813-.337t.337-.813v-3.7q0-.475-.337-.812T8.4 9H6zm1.15-1.15v-3.7H8.4v3.7zM10.875 15h2.45v-1.15h-2.05v-1.3h1.3V11.4h-1.3v-1.25h2.05V9h-2.45q-.325 0-.537.212t-.213.538v4.5q0 .325.213.538t.537.212m5.15-.025q.325 0 .563-.213t.312-.537L18.3 9h-1.2l-1.075 4.1L14.95 9h-1.2l1.4 5.225q.075.325.313.538t.562.212M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z" />
                </svg>
                <Link href="/" className="text-color_text text-base mr-4">Home</Link>
                <Link href="/dashboard" className="text-color_text text-md">Dashboard</Link>
            </div>

            {/* MENU BUTTON */}
            <div className="md:hidden flex items-center" ref={menuIconRef}>
                <button
                    className="text-color_text text-md focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? (

                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-color_icons" width="2em" height="2em" viewBox="0 0 24 24">
                            <path d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-color_icons" width="2em" height="2em" viewBox="0 0 24 24">
                            <path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1" />
                        </svg>
                    )
                    }
                </button>
            </div>

            {/* MENU MOBILE */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute mt-36 bg-color_sec shadow-md border border-border_detail rounded-md w-48 p-2" ref={menuRef}>
                    <div className="flex flex-col">
                        <Link href="/" onClick={toggleMobileMenu} className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75" />
                            </svg>
                            Home
                        </Link>
                        <Link href="/dashboard" onClick={toggleMobileMenu} className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                <path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75" />
                            </svg>
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}