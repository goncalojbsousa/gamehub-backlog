'use server'

/**
 * Validates a reCAPTCHA token with Google's verification service
 * Sends the token to Google's verification endpoint to confirm it's from a human user
 * Uses a score threshold of 0.6 (60% chance of being human) for validation
 * 
 * @param token - The reCAPTCHA token to validate
 * @returns Promise resolving to boolean indicating if the token is valid
 */
export const validateRecaptchaToken = async (token: string): Promise<Boolean> => {
    // Send verification request to Google's reCAPTCHA API
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: process.env.reCAPTCHA_SECRET_KEY!,
            response: token,
        }).toString(),
    });

    // Parse the verification response
    const data = await response.json();

    // Check if verification was successful and score meets threshold
    if (data.success && data.score >= 0.6){ // 60% chance of being human
        return true;
    } else {
        return false;
    }
};
