'use client'

import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/src/components/sign-out-button";
import Link from "next/link";
import Image from "next/image";
import { ProfileIcon } from "@/src/components/svg/navigation/profile-icon";
import { SettingsIcon } from "@/src/components/svg/navigation/settings";
import { LogoutIcon } from "@/src/components/svg/navigation/logout-icon";
import { useUser } from "@/src/context/userContext";

interface UserProps {
    usernameSlug: string;
    userImage: string;
}

export const NavbarUser: React.FC<UserProps> = ({ usernameSlug, userImage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const profilePicRef = useRef<HTMLImageElement>(null);
    const { isAuthenticated } = useUser();

    // Garantir que sempre temos uma imagem válida
    const validUserImage = userImage && userImage.trim() !== '' && !imageError && userImage.startsWith('http') ? userImage : "/placeholder-user.webp";

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
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

    // Reset image error when userImage changes
    useEffect(() => {
        setImageError(false);
    }, [userImage]);

    // Close menu when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            setMenuOpen(false);
        }
    }, [isAuthenticated]);

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

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error('Failed to load user image:', userImage);
        setImageError(true);
        e.currentTarget.src = "/placeholder-user.webp";
    };

    return (
        <>
            <div className="relative">
                <Image
                    ref={profilePicRef}
                    width={200}
                    height={200}
                    src={validUserImage}
                    alt="Profile picture"
                    className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-border_detail ${menuOpen ? 'ring-2 ring-color_accent' : ''}`}
                    draggable="false"
                    onClick={toggleMenu}
                    onError={handleImageError}
                    unoptimized={userImage?.includes('googleusercontent.com')}
                />
                {menuOpen && (
                    <div 
                        ref={menuRef} 
                        className="absolute top-12 right-0 bg-color_sec shadow-xl border border-border_detail rounded-xl w-56 p-2 z-50"
                    >
                        <div className="flex flex-col gap-1">
                            <Link 
                                href={`/user/${usernameSlug}`} 
                                onClick={closeMenu}
                                className="flex items-center px-4 py-3 text-color_text hover:bg-color_hover rounded-lg transition-all duration-200 active:bg-color_click select-none font-medium"
                            >
                                <ProfileIcon className="mr-3 w-5 h-5" />
                                Profile
                            </Link>
                            {/*<Link href="/settings" className="flex px-4 py-2 text-color_text hover:bg-color_main rounded-md transition-colors duration-200 active:bg-color_click select-none">
                                <SettingsIcon />
                                Settings
                            </Link>
                            <hr className="mt-2 mb-2" />*/}
                            
                            <SignOutButton className="flex w-full items-center px-4 py-3 text-color_text hover:bg-btn_logout rounded-lg transition-all duration-200 active:bg-color_click select-none font-medium">
                                <LogoutIcon className="mr-3 w-5 h-5" />
                                Logout
                            </SignOutButton>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}