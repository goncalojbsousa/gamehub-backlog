'use server'

import { signIn } from "@/src/lib/auth/authConfig";
import { validateRecaptchaToken } from "../validateRecaptchaToken";

export const handleEmailSignIn = async (email: string, token: string) => {

    // VALIDATE RECAPTCHA
    const isValidToken = await validateRecaptchaToken(token);

    if (isValidToken) {
        try {
            await signIn("nodemailer", { email, callbackUrl: "/dashboard" })
        } catch (error) {
            throw error;
        }
    } else {
        console.error("It's not human");
    }

}