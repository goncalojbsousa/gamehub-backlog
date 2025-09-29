'use client'

import { useRouter } from "next/navigation"

/**
 * SignInButton component - Navigation button for authentication
 * Provides a consistent sign-in button that navigates to the authentication page
 * Supports custom styling and content through props
 * 
 * @param props.children - Optional custom content to display in the button
 * @param props.className - Optional CSS classes for custom styling
 * @returns JSX element representing a sign-in button
 */
export const SignInButton = (props: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const router = useRouter();

    return (
        <button className={props.className} onClick={() => {
            router.push("/auth/sign-in");
        }}>
            {props.children || "Sign In"}
        </button>
    )
}