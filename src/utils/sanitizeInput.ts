import { escape } from 'html-escaper';

/**
 * 
 * @param input INPUT TEXT
 * @returns SANITIZED INPUT TEXT
 */
export const sanitizeInput = (input: string): string => {
    // REMOVES POTENTIALLY DANGEROUS CHARACTERS
    return input
        // g - THE REPLACEMENT MUST BE DONE ON HOLE STRING
        // i - MATCHING MUST BE CASE INSENSITIVE
        .replace(/[^\p{L}\p{N} áàâãéèêíïóôõöúçñ:_\-']/gu, '')
        .substring(0, 100);
};


interface UserGameStatus {
    id: number;
    user_id: number;
    game_id: number;
    status: string;
    progress: number;
    created_at: Date;
    updated_at: Date | string;
  }

/**
 * 
 * @param data 
 * @returns SANITIZED OUTPUT
 */
export function sanitizeOutput(data: UserGameStatus): Partial<UserGameStatus> {
  return {
    id: data.id,
    game_id: data.game_id,
    status: escape(data.status),
    progress: Math.min(Math.max(data.progress, 0), 100), // Garante que o progresso está entre 0 e 100
    updated_at: data.updated_at.toString()
  };
}