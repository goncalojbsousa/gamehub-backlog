import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton
 *
 * Next.js (especially in development with HMR) can import server files multiple times,
 * which would create multiple PrismaClient instances and quickly exhaust DB connections.
 *
 * We store a single instance on globalThis in dev to reuse it across reloads.
 * In production, module scope is stable per server instance, so a normal instance is fine.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Enable verbose logs in development if required
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
