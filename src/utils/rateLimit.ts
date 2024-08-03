'use server'

import { pool } from "@/src/lib/postgres";

const MAX_REQUESTS_PER_MINUTE = 20; // 20 REQUEST PER MINUTE
const BLOCK_DURATION = 5 * 60 * 1000; // 5 MINUTES
const BLOCK_THRESHOLD = 3; // NUMBER OF VIOLATIONS BEFORE BLOCKING

/**
 * Checks if the client has exceeded the rate limit.
 * @param clientIp The IP address of the client.
 * @returns {boolean} True if the request is allowed, false otherwise.
 */
export async function checkRateLimit(clientIp: string): Promise<boolean> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const now = Math.floor(Date.now() / 1000);

        // Verifique se o usuário está bloqueado
        const blockResult = await client.query(
            'SELECT block_until FROM rate_limit_blocks WHERE ip = $1 AND block_until > $2',
            [clientIp, now]
        );

        if (blockResult.rows.length > 0) {
            await client.query('COMMIT');
            return false;
        }

        // Conte as requisições na última janela de 1 minuto
        const countResult = await client.query(
            'SELECT COUNT(*) FROM rate_limit_requests WHERE ip = $1 AND timestamp > $2',
            [clientIp, now - 60]
        );

        const requestCount = parseInt(countResult.rows[0].count);

        if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
            // Incrementar violações
            const violationResult = await client.query(
                'INSERT INTO rate_limit_violations (ip, violations) VALUES ($1, 1) ON CONFLICT (ip) DO UPDATE SET violations = rate_limit_violations.violations + 1 RETURNING violations',
                [clientIp]
            );

            const violations = violationResult.rows[0].violations;

            if (violations >= BLOCK_THRESHOLD) {
                await client.query(
                    'INSERT INTO rate_limit_blocks (ip, block_until) VALUES ($1, $2) ON CONFLICT (ip) DO UPDATE SET block_until = $2',
                    [clientIp, now + BLOCK_DURATION]
                );
            }

            await client.query('COMMIT');
            return false;
        }

        // Adicionar nova requisição
        await client.query(
            'INSERT INTO rate_limit_requests (ip, timestamp) VALUES ($1, $2)',
            [clientIp, now]
        );

        // Resetar violações se estiver dentro do limite
        await client.query('DELETE FROM rate_limit_violations WHERE ip = $1', [clientIp]);

        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}