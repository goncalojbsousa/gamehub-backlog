'use client'

import { useRouter } from "next/navigation"
import { useLogout } from "../lib/auth/useLogout";

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