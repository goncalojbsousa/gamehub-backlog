/**
 * Utility functions for form validation
 */

/**
 * Validates a username and returns validation result
 */
export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUsername = (username: string): UsernameValidationResult => {
  // Check if username is empty
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Username is required'
    };
  }

  // Check minimum length
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long'
    };
  }

  // Check maximum length
  if (username.length > 255) {
    return {
      isValid: false,
      error: 'Username must be less than 255 characters'
    };
  }

  // Check for invalid characters
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, underscores (_), and hyphens (-). No spaces allowed.'
    };
  }

  // Check if username starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return {
      isValid: false,
      error: 'Username must start with a letter or number'
    };
  }

  // Check if username ends with a letter or number
  if (!/[a-zA-Z0-9]$/.test(username)) {
    return {
      isValid: false,
      error: 'Username must end with a letter or number'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Sanitizes a username by removing invalid characters
 */
export const sanitizeUsername = (username: string): string => {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters
    .replace(/^[^a-zA-Z0-9]+/, '') // Remove leading invalid characters
    .replace(/[^a-zA-Z0-9]+$/, ''); // Remove trailing invalid characters
}; 