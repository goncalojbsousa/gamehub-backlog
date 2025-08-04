'use client';

import { useState, useEffect } from 'react';
import { UserManagement } from './user-management';
import { ReviewManagement } from './review-management';
import { SystemStats } from './system-stats';
import { SecuritySettings } from './security-settings';
import { AuditLogs } from './audit-logs';

type TabType = 'users' | 'reviews' | 'stats' | 'security' | 'audit';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const tabs = [
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'reviews', name: 'Review Management', icon: '📝' },
    { id: 'stats', name: 'System Statistics', icon: '📊' },
    { id: 'security', name: 'Security Settings', icon: '🔒' },
    { id: 'audit', name: 'Audit Logs', icon: '📋' }
  ];

  if (isLoading) {
    return (
      <div className="bg-color_sec rounded-xl p-6 border border-border_detail">
        <div className="animate-pulse">
          <div className="h-8 bg-color_hover rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-color_hover rounded w-full"></div>
            <div className="h-4 bg-color_hover rounded w-3/4"></div>
            <div className="h-4 bg-color_hover rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-color_sec rounded-xl border border-border_detail overflow-hidden">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-color_main text-color_text border-b-2 border-color_reverse_sec'
                  : 'text-color_text_sec hover:text-color_text hover:bg-color_hover'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-color_sec rounded-xl border border-border_detail">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'reviews' && <ReviewManagement />}
        {activeTab === 'stats' && <SystemStats />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'audit' && <AuditLogs />}
      </div>
    </div>
  );
}; 