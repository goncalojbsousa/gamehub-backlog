'use client'

import { useRouter } from "next/navigation"
import { useLogout } from "@/src/lib/auth/useLogout";

/**
 * SignOutButton component - Logout functionality button
 * Provides a consistent sign-out button that handles user logout
 * Uses the useLogout hook for proper session cleanup and navigation
 * 
 * @param props.children - Optional custom content to display in the button
 * @param props.className - Optional CSS classes for custom styling
 * @returns JSX element representing a sign-out button
 */
export const SignOutButton = (props: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const router = useRouter();
    const handleLogout = useLogout();
    return (
        <button className={props.className} onClick={handleLogout}>
            {props.children || "Sign Out"}
        </button>
    )
}