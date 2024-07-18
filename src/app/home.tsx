'use client'

import { useEffect, useState } from "react";
import { Navbar } from "@/src/components/navbar/navbar";
import { getUserName } from "@/src/lib/auth/getUserNameServerAction";
import { getUserImage } from "../lib/auth/getUserImageServerAction copy";
import { useUser } from "@/src/context/userContext";
import { fetchGamesBySearch } from "../services/igdbServices/searchGames";

interface HomeProps {
    isAuthenticated: boolean
}

export default function HomePage({ isAuthenticated }: HomeProps) {
    const { setUsername, setUserImage } = useUser();

    useEffect(() => {
        if (isAuthenticated) {
            const userInfo = async () => {
                const name = await getUserName();
                if (name) {
                    setUsername(name);
                }
                const userImage = await getUserImage();
                if (userImage) {
                    setUserImage(userImage);
                }
            };
            userInfo();
        }
    }, [isAuthenticated]);


    return (
        <main>
            <Navbar isAuthenticated={isAuthenticated} />
            <div className="p-10 text-color_text">
                Hello
            </div>
        </main>
    );
}
