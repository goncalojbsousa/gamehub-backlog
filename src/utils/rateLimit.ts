'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MAX_REQUESTS_PER_MINUTE = 20; // 20 REQUEST PER MINUTE
const BLOCK_DURATION = 5 * 60; // 5 MINUTES (in seconds)
const BLOCK_THRESHOLD = 3; // NUMBER OF VIOLATIONS BEFORE BLOCKING

/**
 * Checks if the client has exceeded the rate limit.
 * @param clientIp The IP address of the client.
 * @returns {Promise<boolean>} True if the request is allowed, false otherwise.
 */
export async function checkRateLimit(clientIp: string): Promise<boolean> {
    const now = new Date();

    try {
        // Check if the user is blocked
        const block = await prisma.rateLimitBlock.findUnique({
            where: {
                ip: clientIp,
                block_until: { gt: now }
            }
        });

        if (block) {
            return false;
        }

        // Count requests in the last minute
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const requestCount = await prisma.rateLimitRequest.count({
            where: {
                ip: clientIp,
                timestamp: { gt: oneMinuteAgo }
            }
        });

        if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
            // Increment violations
            const violation = await prisma.rateLimitViolation.upsert({
                where: { ip: clientIp },
                update: { violations: { increment: 1 } },
                create: { ip: clientIp, violations: 1 }
            });

            if (violation.violations >= BLOCK_THRESHOLD) {
                const blockUntil = new Date(now.getTime() + BLOCK_DURATION * 1000);
                await prisma.rateLimitBlock.upsert({
                    where: { ip: clientIp },
                    update: { block_until: blockUntil },
                    create: { ip: clientIp, block_until: blockUntil }
                });
            }

            return false;
        }

        // Add new request
        await prisma.rateLimitRequest.create({
            data: {
                ip: clientIp,
                timestamp: now
            }
        });

        // Reset violations if within limit
        await prisma.rateLimitViolation.delete({
            where: { ip: clientIp }
        }).catch(() => {}); // Ignore if no violation exists

        return true;
    } catch (e) {
        console.error('Error in rate limiting:', e);
        throw e;
    } finally {
        await prisma.$disconnect();
    }
}