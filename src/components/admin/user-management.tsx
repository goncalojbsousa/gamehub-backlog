'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string | null;
  role: 'USER' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
  _count: {
    reviews: number;
    gameStatus: number;
  };
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [isBanning, setIsBanning] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/getUsers');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) return;

    setIsBanning(true);
    try {
      const response = await fetch('/api/user/banUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          reason: banReason.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowBanModal(false);
        setSelectedUser(null);
        setBanReason('');
        fetchUsers(); // Refresh the list
      } else {
        alert(result.error || 'Error banning user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Error banning user');
    } finally {
      setIsBanning(false);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch('/api/user/unbanUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      
      if (result.success) {
        fetchUsers(); // Refresh the list
      } else {
        alert(result.error || 'Error unbanning user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Error unbanning user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'ACTIVE' && !user.isBanned) ||
                         (filterStatus === 'BANNED' && user.isBanned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-color_hover rounded-lg w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-color_hover rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-color_text mb-4">User Management</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text placeholder-color_text_sec"
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
          
          <div className="text-sm text-color_text_sec flex items-center justify-center">
            {filteredUsers.length} users found
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              user.isBanned
                ? 'bg-red-50 border-red-200'
                : 'bg-color_main border-border_detail hover:border-border_detail_sec'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={user.image || '/placeholder-user.webp'}
                  alt={`${user.name} avatar`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-color_text">{user.name}</h3>
                    {user.role === 'ADMIN' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                    {user.isBanned && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Banned
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-color_text_sec">{user.email}</p>
                  <p className="text-xs text-color_text_sec">
                    @{user.username} • Joined {formatDistanceToNow(new Date(user.createdAt), { 
                      addSuffix: true, 
                      locale: enUS 
                    })}
                  </p>
                  
                                     <div className="flex items-center gap-4 mt-2 text-xs text-color_text_sec">
                     <span>{user._count.reviews} reviews</span>
                     <span>{user._count.gameStatus} games</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!user.isBanned ? (
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowBanModal(true);
                    }}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Ban User
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Unban User
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ban Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-color_text text-lg">Ban User</h3>
                <p className="text-color_text_sec text-sm">
                  This will ban {selectedUser.name} permanently
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-color_text mb-2">
                Ban Reason:
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for banning this user..."
                className="w-full px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text placeholder-color_text_sec resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUser(null);
                  setBanReason('');
                }}
                className="flex-1 px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim() || isBanning}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBanning ? 'Banning...' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 