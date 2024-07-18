'use client'

import { SignInButton } from "@/src/components/sign-in-button";
import { SearchInput } from "./search-input";
import { NavbarUser } from "./navbar-user";
import { useUser } from "@/src/context/userContext";
import { NavbarLinks } from "./navbar-links";

interface UserProps {
    isAuthenticated: boolean
}

export const Navbar = ({ isAuthenticated }: UserProps) => {
    const { username, userImage } = useUser();
    

    return (
        <div className="bg-color_main flex items-center justify-between md:space-x-8 p-3 xl:px-24">
            <div className="flex items-center">
                <NavbarLinks/>
            </div>

            <div className="hidden md:flex flex-grow justify-center">
                <SearchInput />
            </div>

            <div className="flex items-center justify-center">
                {isAuthenticated ? (
                    <NavbarUser username={username} userImage={userImage} />
                ) : (
                    <SignInButton className="mr-4 lg:mr-32 text-color_text border border-zinc-800 rounded-lg p-2" />
                )
                }
            </div>

        </div>
    );
}