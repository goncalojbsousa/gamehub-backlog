'use client'

import { useUser } from "@/src/context/userContext";
import { handleSignOut } from "./signOutServerAction";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const { logout } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Primeiro limpar o contexto local imediatamente
            logout();
            
            // Limpar qualquer cache local de forma mais agressiva
            if (typeof window !== 'undefined') {
                // Limpar localStorage se houver dados relacionados
                Object.keys(localStorage).forEach(key => {
                    if (key.includes('auth') || key.includes('user') || key.includes('session') || key.includes('next-auth')) {
                        localStorage.removeItem(key);
                    }
                });
                
                // Limpar sessionStorage
                sessionStorage.clear();
                
                // Limpar cookies relacionados ao auth
                document.cookie.split(";").forEach(function(c) { 
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
                });
            }
            
            // Depois fazer o logout no servidor
            await handleSignOut();
            
            // Forçar recarregamento completo da página para limpar qualquer cache
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, forçar recarregamento para garantir limpeza
            window.location.href = '/';
        }
    };

    return handleLogout;
};