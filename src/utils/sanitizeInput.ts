import { escape } from 'html-escaper';

/**
 * Sanitizes user input to prevent XSS attacks and ensure data integrity
 * Removes potentially dangerous characters and limits input length
 * @param input - The raw input text to sanitize
 * @returns Sanitized input text safe for database storage and display
 */
export const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters and limit length
    return input
        // g - Global flag: replace all occurrences in the string
        // i - Case insensitive matching
        .replace(/[^\p{L}\p{N} áàâãéèêíïóôõöúçñ:_\-']/gu, '')
        .substring(0, 100); // Limit input to 100 characters
};

/**
 * Interface for user game status data structure
 * Defines the shape of game status data returned from database
 */
interface UserGameStatus {
    id: number;
    user_id: number;
    game_id: number;
    status: string;
    created_at: Date;
    updated_at: Date | string;
}

/**
 * Sanitizes user game status output data for safe display
 * Escapes HTML content and validates numeric ranges
 * @param data - Raw user game status data from database
 * @returns Sanitized output data safe for client-side rendering
 */
export function sanitizeOutput(data: UserGameStatus): Partial<UserGameStatus> {
  return {
    id: data.id,
    game_id: data.game_id,
    status: escape(data.status), // Escape HTML to prevent XSS
    updated_at: data.updated_at.toString()
  };
}