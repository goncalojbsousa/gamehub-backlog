import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AdminAction {
  action: string;
  adminId: string;
  adminEmail: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminLog {
  id: string;
  action: string;
  adminId: string;
  adminEmail: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Log admin actions for audit purposes
 */
export async function logAdminAction(actionData: AdminAction): Promise<void> {
  try {
    // Validate required fields
    if (!actionData.adminId || !actionData.adminEmail || !actionData.action) {
      console.warn('Missing required fields for admin log:', actionData);
      return;
    }

    // Validate UUID format for adminId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(actionData.adminId)) {
      console.warn('Invalid adminId format:', actionData.adminId, 'type:', typeof actionData.adminId, 'length:', actionData.adminId?.length);
      return;
    }

    await prisma.adminLog.create({
      data: {
        action: actionData.action,
        adminId: actionData.adminId,
        adminEmail: actionData.adminEmail,
        targetId: actionData.targetId,
        targetType: actionData.targetType,
        details: actionData.details,
        ipAddress: actionData.ipAddress,
        userAgent: actionData.userAgent,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
    console.error('Action data that caused the error:', actionData);
    // Don't throw error to avoid breaking the main functionality
  }
}

/**
 * Get admin logs with pagination and filtering
 */
export async function getAdminLogs(
  page: number = 1,
  limit: number = 50,
  filters?: {
    action?: string;
    adminId?: string;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<{ logs: AdminLog[]; total: number }> {
  const skip = (page - 1) * limit;
  
  const whereClause: any = {};
  
  console.log('Debug - getAdminLogs filters:', filters);
  
  if (filters?.action) {
    whereClause.action = {
      contains: filters.action,
      mode: 'insensitive' // Case-insensitive search
    };
    console.log('Debug - Adding action filter:', filters.action);
  }
  
  if (filters?.adminId) {
    // Validate adminId is a valid UUID before filtering
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(filters.adminId)) {
      whereClause.adminId = filters.adminId;
      console.log('Debug - Adding adminId filter:', filters.adminId);
    } else {
      console.warn('Invalid adminId format in filter, ignoring:', filters.adminId);
      // Return empty results if adminId is invalid
      return { logs: [], total: 0 };
    }
  }
  
  if (filters?.targetType) {
    whereClause.targetType = filters.targetType;
    console.log('Debug - Adding targetType filter:', filters.targetType);
  }
  
  if (filters?.startDate || filters?.endDate) {
    whereClause.timestamp = {};
    if (filters.startDate) {
      whereClause.timestamp.gte = filters.startDate;
      console.log('Debug - Adding startDate filter:', filters.startDate);
    }
    if (filters.endDate) {
      whereClause.timestamp.lte = filters.endDate;
      console.log('Debug - Adding endDate filter:', filters.endDate);
    }
  }

  console.log('Debug - Final whereClause:', whereClause);

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit
    }),
    prisma.adminLog.count({ where: whereClause })
  ]);

  console.log('Debug - Query results:', { logsCount: logs.length, total });

  // Sanitize nullable fields from Prisma (string | null) to undefined to match AdminLog
  const sanitizedLogs: AdminLog[] = logs.map((l) => ({
    id: l.id,
    action: l.action,
    adminId: l.adminId,
    adminEmail: l.adminEmail,
    targetId: l.targetId ?? undefined,
    targetType: l.targetType ?? undefined,
    details: l.details ?? undefined,
    ipAddress: l.ipAddress ?? undefined,
    userAgent: l.userAgent ?? undefined,
    timestamp: l.timestamp,
  }));

  return { logs: sanitizedLogs, total };
}

/**
 * Common admin actions for consistent logging
 */
export const AdminActions = {
  USER_BANNED: 'USER_BANNED',
  USER_UNBANNED: 'USER_UNBANNED',
  REVIEW_DELETED: 'REVIEW_DELETED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  SYSTEM_STATS_VIEWED: 'SYSTEM_STATS_VIEWED',
  SECURITY_TEST_RUN: 'SECURITY_TEST_RUN'
} as const;

/**
 * Helper function to extract IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || 
         realIP || 
         cfConnectingIP || 
         'unknown';
}

/**
 * Helper function to get user agent
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
} 