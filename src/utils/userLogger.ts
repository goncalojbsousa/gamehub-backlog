import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Interface for user action logging data
 */
export interface UserAction {
  action: string;           // Type of action performed
  userId: string;           // ID of the user who performed the action
  userEmail?: string;       // Email of the user for audit purposes
  targetId?: string;        // ID of the target entity (user, review, etc.)
  targetType?: string;      // Type of target entity
  details?: string;         // Additional details about the action
  oldValue?: string;        // Previous value (for updates)
  newValue?: string;        // New value (for updates)
  ipAddress?: string;       // IP address of the user
  userAgent?: string;       // User agent string for security tracking
}

/**
 * Interface for UserLog model
 */
export interface UserLog {
  id: string;
  action: string;
  userId: string;
  userEmail?: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Log user actions for audit purposes
 */
export async function logUserAction(actionData: UserAction): Promise<void> {
  try {
    // Validate required fields
    if (!actionData.userId || !actionData.action) {
      console.warn('Missing required fields for user log:', actionData);
      return;
    }

    // Validate UUID format for userId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(actionData.userId)) {
      console.warn('Invalid userId format:', actionData.userId, 'type:', typeof actionData.userId, 'length:', actionData.userId?.length);
      return;
    }

    await prisma.userLog.create({
      data: {
        action: actionData.action,
        userId: actionData.userId,
        userEmail: actionData.userEmail,
        targetId: actionData.targetId,
        targetType: actionData.targetType,
        details: actionData.details,
        oldValue: actionData.oldValue,
        newValue: actionData.newValue,
        ipAddress: actionData.ipAddress,
        userAgent: actionData.userAgent,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error logging user action:', error);
    console.error('Action data that caused the error:', actionData);
    // Don't throw error to avoid breaking the main functionality
  }
}

/**
 * Get user logs with pagination and filtering
 */
export async function getUserLogs(
  page: number = 1,
  limit: number = 50,
  filters?: {
    action?: string;
    userId?: string;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<{ logs: UserLog[]; total: number }> {
  try {
    const whereClause: any = {};
    
    console.log('Debug - getUserLogs filters:', filters);
    
    if (filters?.action) {
      whereClause.action = {
        contains: filters.action,
        mode: 'insensitive' // Case-insensitive search
      };
      console.log('Debug - Adding action filter:', filters.action);
    }
    
    if (filters?.userId) {
      // Validate userId is a valid UUID before filtering
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(filters.userId)) {
        whereClause.userId = filters.userId;
        console.log('Debug - Adding userId filter:', filters.userId);
      } else {
        console.warn('Invalid userId format in filter, ignoring:', filters.userId);
        // Return empty results if userId is invalid
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
      prisma.userLog.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.userLog.count({ where: whereClause })
    ]);

    return {
      logs: logs.map((log: any) => ({
        ...log,
        userEmail: log.userEmail ?? undefined,
        targetId: log.targetId ?? undefined,
        targetType: log.targetType ?? undefined,
        details: log.details ?? undefined,
        oldValue: log.oldValue ?? undefined,
        newValue: log.newValue ?? undefined,
        ipAddress: log.ipAddress ?? undefined,
        userAgent: log.userAgent ?? undefined,
      })),
      total
    };
  } catch (error) {
    console.error('Error fetching user logs:', error);
    return { logs: [], total: 0 };
  }
}

/**
 * Get logs for a specific user
 */
export async function getUserLogsByUserId(
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ logs: UserLog[]; total: number }> {
  return getUserLogs(page, limit, { userId });
}

/**
 * Get logs for a specific action type
 */
export async function getUserLogsByAction(
  action: string,
  page: number = 1,
  limit: number = 50
): Promise<{ logs: UserLog[]; total: number }> {
  return getUserLogs(page, limit, { action });
}

/**
 * Common action types for user logging
 */
export const USER_ACTIONS = {
  USERNAME_CHANGE: 'USERNAME_CHANGE',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  EMAIL_CHANGE: 'EMAIL_CHANGE',
  ACCOUNT_DELETE: 'ACCOUNT_DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REVIEW_CREATE: 'REVIEW_CREATE',
  REVIEW_UPDATE: 'REVIEW_UPDATE',
  REVIEW_DELETE: 'REVIEW_DELETE',
  GAME_STATUS_UPDATE: 'GAME_STATUS_UPDATE',
} as const;

export type UserActionType = typeof USER_ACTIONS[keyof typeof USER_ACTIONS];

