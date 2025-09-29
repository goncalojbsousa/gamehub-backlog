/**
 * User interface - Represents user account information
 * Contains essential user data for authentication and profile display
 * Used throughout the application for user identification and permissions
 */
declare interface User {
    id: string;        // Unique user identifier
    name: string;      // User's display name
    email: string;     // User's email address
    image: string;     // User's profile image URL
    role: string;      // User's role (USER/ADMIN)
};