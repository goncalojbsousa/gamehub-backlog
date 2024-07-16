'use server'

import { auth } from "@/src/lib/auth/authConfig";
import { pool } from "@/src/lib/postgres";

export const getUserRole = async () => {
    const session = await auth();
    if (session) {
        const uuid: string = session.user?.id || '';

        // SANITIZE INPUT
        const uuidRegExp: RegExp =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
            throw new Error("Invalid UUID");
        };

        const { rows } = await pool.query("SELECT role FROM users WHERE id = $1", [
            uuid,
        ]);
        return rows[0].role;
    };
};