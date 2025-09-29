import { prisma } from '@/src/lib/prisma'

// Rate limiting configuration constants
const MAX_REQUESTS_PER_MINUTE = 60; // Maximum requests allowed per minute per IP
const BLOCK_DURATION = 5 * 60; // Block duration in seconds (5 minutes)
const BLOCK_THRESHOLD = 3; // Number of violations before IP is blocked

/**
 * Checks if the client has exceeded the rate limit
 * Implements a sliding window rate limiting system with progressive blocking
 * Tracks requests per minute and blocks IPs that repeatedly violate limits
 * 
 * @param clientIp - The IP address of the client making the request
 * @returns Promise<boolean> - True if request is allowed, false if blocked
 */
export async function checkRateLimit(clientIp: string): Promise<boolean> {
    const now = new Date();

    try {
        // Check if the IP is currently blocked due to previous violations
        const block = await prisma.rateLimitBlock.findUnique({
            where: {
                ip: clientIp,
                block_until: { gt: now } // Only consider active blocks
            }
        });

        // If IP is blocked, deny the request
        if (block) {
            return false;
        }

        // Count requests made by this IP in the last minute
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const requestCount = await prisma.rateLimitRequest.count({
            where: {
                ip: clientIp,
                timestamp: { gt: oneMinuteAgo }
            }
        });

        // If request count exceeds the limit, handle violation
        if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
            // Increment violation count for this IP
            const violation = await prisma.rateLimitViolation.upsert({
                where: { ip: clientIp },
                update: { violations: { increment: 1 } },
                create: { ip: clientIp, violations: 1 }
            });

            // If violation threshold is reached, block the IP
            if (violation.violations >= BLOCK_THRESHOLD) {
                const blockUntil = new Date(now.getTime() + BLOCK_DURATION * 1000);
                await prisma.rateLimitBlock.upsert({
                    where: { ip: clientIp },
                    update: { block_until: blockUntil },
                    create: { ip: clientIp, block_until: blockUntil }
                });
            }

            // Deny the request due to rate limit violation
            return false;
        }

        // Record this request in the database
        await prisma.rateLimitRequest.create({
            data: {
                ip: clientIp,
                timestamp: now
            }
        });

        // Reset violation count if IP is within limits
        // This provides a "forgiveness" mechanism for good behavior
        await prisma.rateLimitViolation.delete({
            where: { ip: clientIp }
        }).catch(() => {}); // Ignore error if no violation record exists

        // Allow the request
        return true;
    } catch (e) {
        console.error('Error in rate limiting:', e);
        // Fail open: do not block the user flow if rate limit storage fails
        return true;
    }
}