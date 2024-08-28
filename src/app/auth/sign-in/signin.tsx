'use client'

import { Logo } from "@/src/components/svg/logo";
import { handleGoogleSignIn } from "@/src/lib/auth/googleSignInServerAction";
import { FcGoogle } from "react-icons/fc";

export const SignInPage: React.FC = () => {

    return (
        <div className="flex justify-center items-center h-screen"
            style={{
                backgroundImage: 'url(/login-bg.webp)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat' 
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: 'var(--login-bg)' 
                }}
            ></div>

            <div className="relative  w-80 p-8 rounded-lg shadow-md bg-color_sec text-center">
                <div className="flex space-x-4 items-center justify-center mb-6">
                    <Logo className="fill-color_icons" width="4em" height="4em" />
                    <h2 className="text-2xl text-color_text font-bold ">Join us!</h2>
                </div>
                <div className="flex flex-col items-center text-color_text">

                    <button onClick={() => handleGoogleSignIn()} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 hover:border-blue-400 focus:border-border_detail focus:outline-none">
                        <FcGoogle className="text-xl" />
                        <span className="text-base">Sign in with Google</span>
                    </button>
                    <p className="mt-4 text-color_text">More sign-in methods are planned for the future!</p>
                </div>
            </div>
        </div>
    )
};