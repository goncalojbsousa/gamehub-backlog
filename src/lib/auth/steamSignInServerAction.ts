'use server'

import { signIn } from "@/src/lib/auth/authConfig";

export const handleSteamSignIn = async () => {
  try {
    await signIn("steam", { redirectTo: "/" });
  } catch (error) {
    throw error;
  }
}
