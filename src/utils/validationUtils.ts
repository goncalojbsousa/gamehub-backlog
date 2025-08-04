/**
 * Utility functions for form validation
 * Provides comprehensive validation and sanitization for user input data
 * Ensures data integrity and security across the application
 */

/**
 * Interface defining the result of username validation
 * Contains validation status and optional error message
 */
export interface UsernameValidationResult {
  isValid: boolean;    // Whether the username passes all validation rules
  error?: string;      // Error message if validation fails
}

/**
 * Validates a username against comprehensive rules
 * Checks length, character restrictions, and format requirements
 * Ensures usernames are safe for URLs and database storage
 * 
 * @param username - The username string to validate
 * @returns UsernameValidationResult object with validation status and error details
 */
export const validateUsername = (username: string): UsernameValidationResult => {
  // Check if username is empty or contains only whitespace
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Username is required'
    };
  }

  // Check minimum length requirement (3 characters)
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long'
    };
  }

  // Check maximum length requirement (255 characters for database compatibility)
  if (username.length > 255) {
    return {
      isValid: false,
      error: 'Username must be less than 255 characters'
    };
  }

  // Check for invalid characters using regex pattern
  // Only allows letters, numbers, underscores, and hyphens
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores (_), and hyphens (-). No spaces allowed.'
    };
  }

  // Check if username starts with a letter or number
  // Prevents usernames starting with special characters
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return {
      isValid: false,
      error: 'Username must start with a letter or number'
    };
  }

  // Check if username ends with a letter or number
  // Prevents usernames ending with special characters
  if (!/[a-zA-Z0-9]$/.test(username)) {
    return {
      isValid: false,
      error: 'Username must end with a letter or number'
    };
  }

  // All validation checks passed
  return {
    isValid: true
  };
};

/**
 * Sanitizes a username by removing invalid characters and normalizing format
 * Converts to lowercase and removes leading/trailing invalid characters
 * Useful for cleaning user input before validation or storage
 * 
 * @param username - The raw username string to sanitize
 * @returns Sanitized username string safe for use
 */
export const sanitizeUsername = (username: string): string => {
  return username
    .trim()                                    // Remove leading/trailing whitespace
    .toLowerCase()                             // Convert to lowercase for consistency
    .replace(/[^a-zA-Z0-9_-]/g, '')           // Remove invalid characters
    .replace(/^[^a-zA-Z0-9]+/, '')            // Remove leading invalid characters
    .replace(/[^a-zA-Z0-9]+$/, '');           // Remove trailing invalid characters
}; 