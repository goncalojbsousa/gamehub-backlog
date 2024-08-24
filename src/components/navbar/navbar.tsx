'use client'

import { SignInButton } from "@/src/components/sign-in-button";
import { SearchInput } from "@/src/components/navbar/search/navbar-search";
import { NavbarUser } from "@/src/components/navbar/navbar-user";
import { useUser } from "@/src/context/userContext";
import { NavbarLinks } from "@/src/components/navbar/navbar-links";
import ThemeToggle from "../theme-toggle";

export const Navbar = () => {
    const { username, usernameSlug, userImage, isAuthenticated } = useUser();

    return (
        <div className="bg-color_main fixed top-0 left-0 w-full z-50 flex items-center justify-between md:space-x-8 p-3 xl:px-24 transition-colors duration-200 h-16">
            <div className="flex items-center">
                <NavbarLinks />
            </div>

            <div className="hidden md:flex flex-grow justify-center">
                <SearchInput />
            </div>

            <div className="flex items-center justify-center">
                <div className="mr-4">
                    <ThemeToggle />
                </div>
                {isAuthenticated ? (
                    <NavbarUser userImage={userImage} usernameSlug={usernameSlug} />
                ) : (
                    <SignInButton className="text-color_text border border-border_detail rounded-lg py-2 px-4" />
                )
                }
            </div>
        </div>
    );
}