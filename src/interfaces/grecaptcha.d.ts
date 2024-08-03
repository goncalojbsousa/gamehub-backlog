interface RecaptchaConfig {
    action: string;
}

declare interface Grecaptcha {
    ready: (callback: () => void) => void
    execute: (site_key: string, config: RecaptchaConfig) => Promise<string>
}

declare const grecaptcha: Grecaptcha;