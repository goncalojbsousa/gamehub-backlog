'use client'

import { Logo } from "@/src/components/svg/logo";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { handleDiscordSignIn } from "@/src/lib/auth/discordSignInServerAction";
import { handleSteamSignIn } from "@/src/lib/auth/steamSignInServerAction";
import { handleEmailSignIn } from "@/src/lib/auth/emailSignInServerAction";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { SiSteam } from "react-icons/si";
import Link from "next/link";
import { useState } from "react";

export const SignInPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_reCAPTCHA_SITE_KEY as string | undefined;

    const onEmailSignIn = async () => {
        if (!email) return;
        try {
            setSubmitting(true);
            let token = "";
            if (typeof window !== "undefined" && (window as any).grecaptcha && siteKey) {
                const grecaptcha = (window as any).grecaptcha;
                if (grecaptcha.execute) {
                    token = await grecaptcha.execute(siteKey, { action: 'submit' });
                }
            }
            await handleEmailSignIn(email, token);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }
    const mainStyle = {
        backgroundImage: `
            linear-gradient(to bottom, var(--gradient-start), var(--background)),
            url(/login-bg.webp)
        `,
        backgroundSize: '100% 1200px',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--background)',
    };

    return (
        <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background" style={mainStyle}>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                </div>

                <div className="relative z-10">
                    <div className="container mx-auto px-4 lg:px-8 py-16">
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <div className="w-full max-w-md">
                                {/* Login Card */}
                                <div className="animate-on-load animate-slide-in-up">
                                    <div className="bg-color_sec border border-border_detail rounded-2xl shadow-2xl p-8 text-center">
                                        {/* Logo and Title */}
                                        <div className="flex flex-col items-center mb-8">
                                            <div className="mb-4">
                                                <Logo className="fill-color_icons" width="4em" height="4em" />
                                            </div>
                                            <h1 className="text-3xl font-bold text-color_text mb-2">
                                                Welcome to GameHub
                                            </h1>
                                            <p className="text-color_text_sec text-lg">
                                                Join our gaming community
                                            </p>
                                        </div>

                                        {/* Sign In Buttons */}
                                        <div className="space-y-6">
                                            <button 
                                                onClick={() => handleGoogleSignIn()} 
                                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-color_reverse_sec text-color_main rounded-xl hover:bg-color_reverse transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-border_detail"
                                            >
                                                <FcGoogle className="text-xl" />
                                                <span className="text-base">Sign in with Google</span>
                                            </button>

                                            <button 
                                                onClick={() => handleDiscordSignIn()} 
                                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#5865F2] text-white rounded-xl hover:brightness-110 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-border_detail"
                                            >
                                                <FaDiscord className="text-xl" />
                                                <span className="text-base">Sign in with Discord</span>
                                            </button>

                                            <button 
                                                onClick={() => handleSteamSignIn()} 
                                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#171a21] text-white rounded-xl hover:brightness-110 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-border_detail"
                                            >
                                                <SiSteam className="text-xl" />
                                                <span className="text-base">Sign in with Steam</span>
                                            </button>

                                            <div className="pt-2 text-left">
                                                <label className="block text-sm text-color_text_sec mb-2">Or sign in with email</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="flex-1 px-4 py-3 rounded-xl border border-border_detail bg-color_main text-color_text placeholder:text-color_text_sec focus:outline-none focus:ring-2 focus:ring-color_accent"
                                                    />
                                                    <button
                                                        disabled={submitting || !email}
                                                        onClick={onEmailSignIn}
                                                        className="px-5 py-3 rounded-xl bg-color_reverse_sec text-color_main border border-border_detail disabled:opacity-60"
                                                    >
                                                        {submitting ? 'Sending…' : 'Send link'}
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                <p className="text-color_text_sec text-sm">
                                                    More sign-in methods coming soon! Steam is next.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Features Preview */}
                                        <div className="mt-8 pt-6 border-t border-border_detail">
                                            <div className="grid grid-cols-1 gap-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-color_accent rounded-full"></div>
                                                    <span className="text-color_text_sec text-sm">Track your gaming progress</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-color_accent rounded-full"></div>
                                                    <span className="text-color_text_sec text-sm">Discover new games</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-color_accent rounded-full"></div>
                                                    <span className="text-color_text_sec text-sm">Share your gaming journey</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Back to Home Link */}
                                        <div className="mt-6 pt-4 border-t border-border_detail">
                                            <Link 
                                                href="/" 
                                                className="text-color_text_sec hover:text-color_text transition-colors duration-200 text-xs"
                                            >
                                                ← Back to home
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};