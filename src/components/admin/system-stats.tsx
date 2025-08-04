'use client';

import { useState, useEffect } from 'react';

interface SystemStats {
  totalUsers: number;
  totalReviews: number;
  totalGames: number;
  bannedUsers: number;
  activeUsers: number;
  averageRating: number;
  reviewsThisMonth: number;
  usersThisMonth: number;
}

export const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/getStats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-color_hover rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-color_hover rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-color_text_sec">
          Failed to load statistics
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
      description: 'Registered users'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: '✅',
      color: 'bg-green-500',
      description: 'Non-banned users'
    },
    {
      title: 'Banned Users',
      value: stats.bannedUsers,
      icon: '🚫',
      color: 'bg-red-500',
      description: 'Suspended accounts'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: '📝',
      color: 'bg-purple-500',
      description: 'All reviews'
    },
    {
      title: 'Games Tracked',
      value: stats.totalGames,
      icon: '🎮',
      color: 'bg-orange-500',
      description: 'Games with status'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: '⭐',
      color: 'bg-yellow-500',
      description: 'Overall rating'
    },
    {
      title: 'Reviews This Month',
      value: stats.reviewsThisMonth,
      icon: '📅',
      color: 'bg-indigo-500',
      description: 'New reviews'
    },
    {
      title: 'New Users This Month',
      value: stats.usersThisMonth,
      icon: '🆕',
      color: 'bg-pink-500',
      description: 'Recent registrations'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-color_text mb-4">System Statistics</h2>
        <p className="text-color_text_sec">
          Overview of platform activity and user engagement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-color_main rounded-xl p-6 border border-border_detail hover:border-border_detail_sec transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${card.color}`}>
                <span className="text-xl">{card.icon}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-color_text">{card.value}</div>
                <div className="text-sm text-color_text_sec">{card.title}</div>
              </div>
            </div>
            <p className="text-xs text-color_text_sec">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-color_main rounded-xl p-6 border border-border_detail">
          <h3 className="text-lg font-semibold text-color_text mb-4">User Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-color_text_sec">Active vs Banned Users</span>
              <span className="text-color_text font-medium">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% active
              </span>
            </div>
            <div className="w-full bg-color_sec rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-color_main rounded-xl p-6 border border-border_detail">
          <h3 className="text-lg font-semibold text-color_text mb-4">Review Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-color_text_sec">Reviews per User</span>
              <span className="text-color_text font-medium">
                {(stats.totalReviews / stats.totalUsers).toFixed(1)} avg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-color_text_sec">Monthly Growth</span>
              <span className="text-color_text font-medium">
                +{stats.reviewsThisMonth} reviews
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 