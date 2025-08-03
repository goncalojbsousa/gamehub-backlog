'use server'

import { auth } from "@/src/lib/auth/authConfig"

export const getUserImage = async () => {
    const session = await auth();
    if (session && session.user?.image) {
        let image = session.user.image.trim();
        
        // Garantir que a URL do Google seja válida
        if (image.includes('googleusercontent.com')) {
            // Remover parâmetros de tamanho se existirem e adicionar tamanho adequado
            image = image.replace(/=s\d+-c$/, '=s200-c');
        }
        
        console.log('User image from session:', image);
        // Retornar null se a imagem estiver vazia após trim
        return image || null;    
    }
    return null;
};