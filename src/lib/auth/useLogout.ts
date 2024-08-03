'use client'

import { useUser } from "@/src/context/userContext";
import { handleSignOut } from "./signOutServerAction";

export const useLogout = () => {
    const { logout } = useUser();

    const handleLogout = async () => {
        try {
            await handleSignOut();
            logout();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    };

    return handleLogout;
};