'use client'

import { SignInButton } from "@/src/components/sign-in-button";
import { SearchInput } from "./search/navbar-search";
import { NavbarUser } from "./navbar-user";
import { useUser } from "@/src/context/userContext";
import { NavbarLinks } from "./navbar-links";

export const Navbar = () => {
    const { username, userImage, isAuthenticated } = useUser();

    return (
        <div className="bg-color_main fixed top-0 left-0 w-full z-50 flex items-center justify-between md:space-x-8 p-3 xl:px-24 transition-colors duration-200 h-16">
            <div className="flex items-center">
                <NavbarLinks />
            </div>

            <div className="hidden md:flex flex-grow justify-center">
                <SearchInput />
            </div>

            <div className="flex items-center justify-center">
                {isAuthenticated ? (
                    <NavbarUser username={username} userImage={userImage} />
                ) : (
                    <SignInButton className="text-color_text border border-border_detail rounded-lg py-2 px-4" />
                )
                }
            </div>
        </div>
    );
}