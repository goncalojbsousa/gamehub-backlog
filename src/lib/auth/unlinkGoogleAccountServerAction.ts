'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { pool } from "@/src/lib/postgres";

export const unlinkGoogleAccount = async () => {
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const uuid: string = session.user?.id || '';

    // SANITIZE INPUT
    const uuidRegExp: RegExp =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
        throw new Error("Invalid UUID");
    }

    // CHECK IF USER HAS A GOOGLE ACCOUNT LINKED
    try {
        const result = await pool.query(
            "DELETE FROM accounts WHERE provider = 'google' AND \"userId\" = $1",
            [uuid]
        );
        return true;
    } catch (error) {
        console.error("Failed to unlink google account", error);
    }
}