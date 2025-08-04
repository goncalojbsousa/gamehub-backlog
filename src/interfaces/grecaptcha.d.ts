/**
 * RecaptchaConfig interface - Configuration for Google reCAPTCHA
 * Defines the configuration options for reCAPTCHA execution
 */
interface RecaptchaConfig {
    action: string;    // Action name for reCAPTCHA verification
}

/**
 * Grecaptcha interface - Google reCAPTCHA API
 * Type definitions for the Google reCAPTCHA JavaScript API
 * Used for bot protection and form validation
 */
declare interface Grecaptcha {
    ready: (callback: () => void) => void  // Callback when reCAPTCHA is ready
    execute: (site_key: string, config: RecaptchaConfig) => Promise<string>  // Execute reCAPTCHA verification
}

/**
 * Global grecaptcha instance
 * Provides access to the Google reCAPTCHA API throughout the application
 */
declare const grecaptcha: Grecaptcha;