'use client'

import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "../sign-out-button";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/src/components/theme-toggle";
import { ProfileIcon } from "@/src/components/svg/navigation/profile-icon";
import { SettingsIcon } from "@/src/components/svg/navigation/settings";
import { LogoutIcon } from "@/src/components/svg/navigation/logout-icon";

interface UserProps {
    usernameSlug: string;
    userImage: string;
}

export const NavbarUser: React.FC<UserProps> = ({ usernameSlug, userImage }) => {
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
            <div className="mr-4">
                <ThemeToggle />
            </div>

            <Image
                ref={profilePicRef}
                width={200}
                height={200}
                src={userImage ? userImage : "/placeholder-user.png"} alt="Profile picture"
                className={`w-10 rounded-full cursor-pointer ${menuOpen ? 'rounded-xl' : ''}`}
                draggable="false"
                onClick={toggleMenu}
            />
            {menuOpen && (
                <div ref={menuRef} className="absolute mt-52 mr-24 bg-color_sec shadow-md border border-border_detail rounded-md w-48 p-2">
                    <Link href={`/user/${usernameSlug}`} className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200 active:bg-color_click select-none">
                        <ProfileIcon />
                        Profile
                    </Link>
                    <Link href="/settings" className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200 active:bg-color_click select-none">
                        <SettingsIcon />
                        Settings
                    </Link>
                    <hr className="mt-2 mb-2" />
                    <SignOutButton className="w-full flex justify-start itens-center px-4 py-2 text-color_text hover:bg-btn_logout rounded-md transition-colors duration-200 select-none">
                        <LogoutIcon />
                        Logout
                    </SignOutButton>
                </div>
            )}
        </>
    );
}