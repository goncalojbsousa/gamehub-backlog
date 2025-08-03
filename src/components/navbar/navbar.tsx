'use client'

import { SignInButton } from "@/src/components/sign-in-button";
import { SearchInput } from "@/src/components/navbar/search/navbar-search";
import { NavbarUser } from "@/src/components/navbar/navbar-user";
import { useUser } from "@/src/context/userContext";
import { NavbarLinks } from "@/src/components/navbar/navbar-links";
import ThemeToggle from "../theme-toggle";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const { username, usernameSlug, userImage, isAuthenticated } = useUser();
    const [clientIsAuthenticated, setClientIsAuthenticated] = useState(isAuthenticated);

    // Sincronizar o estado do cliente com o contexto
    useEffect(() => {
        setClientIsAuthenticated(isAuthenticated);
    }, [isAuthenticated]);

    // Verificação adicional: se não há dados de usuário válidos, considerar como não autenticado
    const shouldShowUser = clientIsAuthenticated && username && usernameSlug;

    return (
        <div className="bg-color_sec fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 lg:px-8 transition-all duration-200 h-16 shadow-lg border-b border-border_detail backdrop-blur-sm">
            <div className="flex items-center">
                <NavbarLinks />
            </div>

            <div className="hidden md:flex flex-grow justify-center max-w-2xl mx-8">
                <SearchInput />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <ThemeToggle />
                </div>
                {shouldShowUser ? (
                    <NavbarUser userImage={userImage} usernameSlug={usernameSlug} />
                ) : (
                    <SignInButton className="text-color_main bg-color_reverse_sec border border-border_detail rounded-lg py-2 px-6 transition-all duration-200 hover:bg-color_reverse hover:shadow-lg hover:-translate-y-0.5 font-medium" />
                )}
            </div>
        </div>
    );
}