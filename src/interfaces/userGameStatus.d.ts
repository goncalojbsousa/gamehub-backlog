/**
 * UserGameStatus interface - Represents user's progress with a game
 * Contains the current status and progress information for a user's game
 * Used for tracking user gaming progress and backlog management
 */
declare interface UserGameStatus {
    status: string;    // Current game status (playing, completed, etc.)
    progress: string;  // Progress indicator (percentage, hours, etc.)
}