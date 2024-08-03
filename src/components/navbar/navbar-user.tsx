'use client'

import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "../sign-out-button";
import Link from "next/link";
import Image from "next/image";

interface UserProps {
    username: string;
    userImage: string;
}

export const NavbarUser: React.FC<UserProps> = ({ username, userImage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const profilePicRef = useRef<HTMLImageElement>(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node) &&
            profilePicRef.current &&
            !profilePicRef.current.contains(event.target as Node)
        ) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <>
            <Image
                ref={profilePicRef}
                width={200}
                height={200}
                src={userImage ? userImage : "/placeholder-user.jpg"} alt="Profile picture"
                className="w-10 rounded-full cursor-pointer"
                draggable="false"
                onClick={toggleMenu}
            />
            {menuOpen && (
                <div ref={menuRef} className="absolute mt-52 mr-36 bg-color_sec shadow-md border border-border_detail rounded-md w-48 p-2">
                    <Link href="/profile" className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                        </svg>
                        Profile
                    </Link>
                    <Link href="/settings" className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 fill-color_icons" width="1em" height="1em" viewBox="0 0 1024 1024">
                            <path d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256" />
                        </svg>
                        Settings
                    </Link>
                    <hr className="mt-2 mb-2" />
                    <SignOutButton className="w-full flex justify-start itens-center px-4 py-2 text-color_text hover:bg-btn_logout rounded-md transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 mt-1 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                            <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
                        </svg>
                        Logout
                    </SignOutButton>
                </div>
            )}
        </>
    );
}