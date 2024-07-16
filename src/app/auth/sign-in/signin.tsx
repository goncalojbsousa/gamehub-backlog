'use client'

import { handleEmailSignIn } from "@/src/lib/auth/emailSignInServerAction";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import Script from "next/script";
import { useState, useTransition } from "react";
import { FcGoogle } from "react-icons/fc";

export const SignInPage: React.FC = () => {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({ email: "" as string });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const site_key = process.env.NEXT_PUBLIC_reCAPTCHA_SITE_KEY!;
            const token = await new Promise<string>((resolve) => {
                grecaptcha.ready(() => {
                    grecaptcha.execute(site_key, { action: 'submit' }).then(resolve);
                });
            });
    
            startTransition(async () => {
                await handleEmailSignIn(formData.email, token);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="w-80 p-8 rounded-lg shadow-md bg-white text-center">
                    <h2 className="text-lg font-bold mb-4">Join us!</h2>
                    <div className="flex flex-col items-center">
                        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                            <input
                                className="mb-4 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:outline-none"
                                type="email"
                                maxLength={320}
                                placeholder="Email"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFormData({ email: event.target.value });
                                }}
                                disabled={isPending}
                                required
                            />
                            <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-gray-400 focus:outline-none">Sign in with email</button>
                        </form>

                        <div className="m-6 text-gray-500">
                            <span>----  or  ----</span>
                        </div>

                        <button onClick={() => handleGoogleSignIn()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:border-blue-400 focus:border-gray-400 focus:outline-none">
                            <FcGoogle className="text-xl" />
                            <span className="text-base">Sign in with Google</span>
                        </button>
                    </div>
                </div>
            </div>
            <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_reCAPTCHA_SITE_KEY}`} />
        </>
    )
};