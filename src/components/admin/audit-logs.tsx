'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * AdminLog interface - Represents an administrative action log entry
 * Contains detailed information about admin actions for audit purposes
 */
interface AdminLog {
  id: string;              // Unique log entry identifier
  action: string;          // Type of admin action performed
  adminId: string;         // ID of the admin who performed the action
  adminEmail: string;      // Email of the admin who performed the action
  targetId?: string;       // ID of the target affected by the action
  targetType?: string;     // Type of target (USER, REVIEW, etc.)
  details?: string;        // Additional details about the action
  ipAddress?: string;      // IP address of the admin when action was performed
  userAgent?: string;      // User agent string of the admin's browser
  timestamp: string;       // When the action was performed
}

/**
 * LogsResponse interface - API response structure for audit logs
 * Contains paginated log data and metadata
 */
interface LogsResponse {
  logs: AdminLog[];        // Array of log entries
  total: number;           // Total number of logs
  page: number;            // Current page number
  limit: number;           // Number of logs per page
  totalPages: number;      // Total number of pages
}

/**
 * AuditLogs component - Administrative audit log viewer
 * Displays comprehensive audit trail of all administrative actions
 * Includes filtering, pagination, and detailed log information
 * Used for security monitoring and compliance purposes
 * 
 * @returns JSX element representing the complete audit logs interface
 */
export const AuditLogs: React.FC = () => {
  // State management for logs data and pagination
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // State management for filters
  const [filters, setFilters] = useState({
    action: '',           // Filter by action type
    adminId: '',          // Filter by admin ID
    targetType: '',       // Filter by target type
    startDate: '',        // Filter by start date
    endDate: ''           // Filter by end date
  });

  /**
   * Fetches audit logs from the admin API with current filters and pagination
   * Updates the logs state and pagination information
   */
  const fetchLogs = useCallback(async () => {
    try {
      // Build query parameters for the API request
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...(filters.action && { action: filters.action }),
        ...(filters.adminId && isValidUUID(filters.adminId) && { adminId: filters.adminId }),
        ...(filters.targetType && { targetType: filters.targetType }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`/api/admin/getLogs?${params}`);
      if (response.ok) {
        const data: LogsResponse = await response.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setTotalLogs(data.total);
      } else {
        console.error('Error fetching logs:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch logs when component mounts or filters/pagination changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * Validates if a string is in proper UUID format
   * Used for admin ID filter validation
   * 
   * @param uuid - String to validate as UUID
   * @returns boolean indicating if the string is a valid UUID
   */
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  /**
   * Handles admin ID filter changes with validation
   * Updates the filters state with the new admin ID value
   * 
   * @param value - New admin ID value to set
   */
  const handleAdminIdChange = (value: string) => {
    setFilters(prev => ({ ...prev, adminId: value }));
  };

  /**
   * Returns appropriate CSS classes for action type styling
   * Provides visual distinction between different action types
   * 
   * @param action - The action type to get color for
   * @returns CSS classes for styling the action badge
   */
  const getActionColor = (action: string) => {
    switch (action) {
      case 'USER_BANNED':
        return 'bg-red-100 text-red-800';
      case 'USER_UNBANNED':
        return 'bg-green-100 text-green-800';
      case 'REVIEW_DELETED':
        return 'bg-orange-100 text-orange-800';
      case 'ADMIN_LOGIN':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Returns appropriate emoji icon for action type
   * Provides visual representation of different action types
   * 
   * @param action - The action type to get icon for
   * @returns Emoji string representing the action
   */
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'USER_BANNED':
        return '🚫';
      case 'USER_UNBANNED':
        return '✅';
      case 'REVIEW_DELETED':
        return '🗑️';
      case 'ADMIN_LOGIN':
        return '🔑';
      default:
        return '📝';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-color_hover rounded-lg w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-color_hover rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header and description */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-color_text mb-4">Audit Logs</h2>
        <p className="text-color_text_sec mb-4">
          View all admin actions for security and compliance purposes
        </p>
        
        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Filter by action..."
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text placeholder-color_text_sec w-full"
            />
          </div>
          
          {/* Admin ID filter with validation */}
          <input
            type="text"
            placeholder="Filter by admin ID (UUID format)..."
            value={filters.adminId}
            onChange={(e) => handleAdminIdChange(e.target.value)}
            className={`px-4 py-2 border rounded-lg bg-color_main text-color_text placeholder-color_text_sec ${
              filters.adminId && !isValidUUID(filters.adminId) 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-border_detail focus:border-border_detail_sec'
            }`}
          />
          {filters.adminId && !isValidUUID(filters.adminId) && (
            <div className="text-red-500 text-xs mt-1">
              Invalid UUID format. Expected: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </div>
          )}
          
          <select
            value={filters.targetType}
            onChange={(e) => setFilters(prev => ({ ...prev, targetType: e.target.value }))}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          >
            <option value="">All Types</option>
            <option value="USER">User</option>
            <option value="REVIEW">Review</option>
            <option value="SYSTEM">System</option>
          </select>
          
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          />
          
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          />
        </div>
        
        {/* Results summary */}
        <div className="text-sm text-color_text_sec mb-4">
          {totalLogs} logs found • Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Logs list */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-color_main rounded-lg p-4 border border-border_detail hover:border-border_detail_sec transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Log header with action icon and timestamp */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getActionIcon(log.action)}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-color_text_sec">
                      {formatDistanceToNow(new Date(log.timestamp), { 
                        addSuffix: true, 
                        locale: enUS 
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Log details */}
                <div className="space-y-1 text-sm">
                  <p className="text-color_text">
                    <span className="font-medium">Admin:</span> {log.adminEmail}
                  </p>
                  
                  {log.targetId && (
                    <p className="text-color_text_sec">
                      <span className="font-medium">Target:</span> {log.targetType} ({log.targetId})
                    </p>
                  )}
                  
                  {log.details && (
                    <p className="text-color_text_sec">
                      <span className="font-medium">Details:</span> {log.details}
                    </p>
                  )}
                  
                  {/* Technical details */}
                  <div className="flex items-center gap-4 text-xs text-color_text_sec">
                    {log.ipAddress && (
                      <span>IP: {log.ipAddress}</span>
                    )}
                    {log.userAgent && (
                      <span className="truncate max-w-xs" title={log.userAgent}>
                        UA: {log.userAgent.substring(0, 50)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-color_text">
            {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}; 