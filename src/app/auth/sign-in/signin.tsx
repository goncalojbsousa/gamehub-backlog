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
            <div className="flex justify-center items-center h-screen"
                style={{
                    backgroundImage: 'url(/login-bg.webp)', // Substitua com o caminho da sua imagem
                    backgroundSize: 'cover', // Ajusta a imagem para cobrir toda a área
                    backgroundPosition: 'center', // Centraliza a imagem
                    backgroundRepeat: 'no-repeat' // Não repete a imagem
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: 'var(--login-bg)' // Substitua a cor e a transparência conforme necessário
                    }}
                ></div>

                <div className="relative  w-80 p-8 rounded-lg shadow-md bg-color_sec text-center">
                    <h2 className="text-lg text-color_text font-bold mb-4">Join us!</h2>
                    <div className="flex flex-col items-center text-color_text">

                        <button onClick={() => handleGoogleSignIn()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:border-blue-400 focus:border-border_detail focus:outline-none">
                            <FcGoogle className="text-xl" />
                            <span className="text-base">Sign in with Google</span>
                        </button>

                        <div className="m-6 text-color_text_sec">
                            <span>----  or  ----</span>
                        </div>
                        <p className="p-4 pt-0">Temporarily unavailable</p>
                        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                            <input
                                className="mb-4 px-4 py-2 rounded-lg bg-color_sec border border-border_detail focus:outline-none"
                                type="email"
                                maxLength={320}
                                placeholder="Email"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFormData({ email: event.target.value });
                                }}
                                //disabled={isPending}
                                disabled={true}
                                required
                            />
                            <button disabled={true} type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg border border-border_detail  focus:outline-none">Sign in with email</button>
                        </form>

                        <small className="flex flex-col text-color_text_sec text-xs mt-6">This site is protected by reCAPTCHA and the Google.
                            <div>
                                <a href="https://policies.google.com/privacy" className="hover:underline">Privacy Policy</a> and
                                <a href="https://policies.google.com/terms" className="hover:underline"> Terms of Service</a> apply.
                            </div>
                        </small>
                    </div>
                </div>
            </div>
            <Script className="grecaptcha-badge" src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_reCAPTCHA_SITE_KEY}`} />
        </>
    )
};