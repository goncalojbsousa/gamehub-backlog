'use client'

/**
 * Props interface for the AdminProfileIndicator component
 * Defines the properties needed to determine if the indicator should be shown
 */
interface AdminProfileIndicatorProps {
  isPrivate: boolean;    // Whether the profile is set to private
  isAdmin: boolean;      // Whether the current user is an administrator
}

/**
 * AdminProfileIndicator component - Shows admin access notification
 * Displays a notification when an admin is viewing a private profile
 * Only renders when both conditions are met: profile is private AND user is admin
 * 
 * @param isPrivate - Boolean indicating if the profile is private
 * @param isAdmin - Boolean indicating if the current user is an admin
 * @returns JSX element for admin notification or null if conditions not met
 */
export const AdminProfileIndicator: React.FC<AdminProfileIndicatorProps> = ({ isPrivate, isAdmin }) => {
  // Only show if profile is private AND user is admin
  if (!isPrivate || !isAdmin) return null;

  return (
    <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm font-medium text-blue-800">
          Admin View: This is a private profile
        </span>
      </div>
      <p className="text-xs text-blue-700 mt-1">
        As an administrator, you can view all profiles regardless of privacy settings.
      </p>
    </div>
  );
}; 