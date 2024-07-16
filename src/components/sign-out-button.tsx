'use client'

import { useRouter } from "next/navigation"
import { handleSignOut } from "../lib/auth/signOutServerAction";

export const SignOutButton = (props: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const router = useRouter();

    return (
        <button className={props.className} onClick={() => {
            handleSignOut();
        }}>
            {props.children || "Sign Out"}
        </button>
    )
}