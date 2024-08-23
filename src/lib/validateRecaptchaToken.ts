'use server'

export const validateRecaptchaToken = async (token: string): Promise<Boolean> => {
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

    const data = await response.json();

    if (data.success && data.score >= 0.6){ // 60% CHANCE OF BEING HUMAN
        return true;
    } else {
        return false;
    }
};
