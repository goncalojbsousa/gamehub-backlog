'use client'

import { SignInButton } from "@/src/components/sign-in-button";
import { SearchInput } from "@/src/components/navbar/search/navbar-search";
import { NavbarUser } from "@/src/components/navbar/navbar-user";
import { useUser } from "@/src/context/userContext";
import { NavbarLinks } from "@/src/components/navbar/navbar-links";
import ThemeToggle from "../theme-toggle";
import { useEffect, useState } from "react";

/**
 * Main navigation bar component
 * Displays navigation links, search functionality, theme toggle, and user authentication status
 * Handles responsive design and user state synchronization
 */
export const Navbar = () => {
    // Get user data and authentication status from context
    const { username, usernameSlug, userImage, userRole, isAuthenticated } = useUser();
    
    // Local state to handle client-side authentication synchronization
    const [clientIsAuthenticated, setClientIsAuthenticated] = useState(isAuthenticated);
    
    /**
     * Synchronize client-side authentication state with context
     * Ensures UI updates properly when authentication status changes
     */
    useEffect(() => {
        setClientIsAuthenticated(isAuthenticated);
    }, [isAuthenticated]);

    // Determine if user data should be displayed
    // Additional verification: if no valid user data exists, consider as not authenticated
    const shouldShowUser = clientIsAuthenticated && username && usernameSlug;

    return (
        <div className="bg-color_sec fixed top-0 left-0 w-full z-50 flex items-center justify-between p-4 lg:px-8 transition-all duration-200 h-16 shadow-lg border-b border-border_detail backdrop-blur-sm">
            {/* Left section - Navigation links */}
            <div className="flex items-center">
                <NavbarLinks />
            </div>

            {/* Center section - Search functionality (hidden on mobile) */}
            <div className="hidden md:flex flex-grow justify-center max-w-2xl mx-8">
                <SearchInput />
            </div>

            {/* Right section - Theme toggle and user authentication */}
            <div className="flex items-center gap-4">
                {/* Theme toggle button */}
                <div className="flex items-center">
                    <ThemeToggle />
                </div>
                
                {/* Conditional rendering based on authentication status */}
                {shouldShowUser ? (
                    // Display user profile information when authenticated
                    <NavbarUser userImage={userImage} usernameSlug={usernameSlug} userRole={userRole} />
                ) : (
                    // Display sign-in button when not authenticated
                    <SignInButton className="text-color_main bg-color_reverse_sec border border-border_detail rounded-lg py-2 px-6 transition-all duration-200 hover:bg-color_reverse hover:shadow-lg hover:-translate-y-0.5 font-medium" />
                )}
            </div>
        </div>
    );
}