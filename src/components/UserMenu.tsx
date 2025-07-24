import { useState, useEffect } from 'react';
import { fetchUser } from '../api/userService';
import type { User } from '@/types/user';

export default function UserMenu() {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await fetchUser();
        setUserProfile(userData);
        
      } catch (err) {
        setError('Không thể tải thông tin người dùng');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="text-right">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {userProfile?.avatar_url ? (
            <img
              src={userProfile.avatar_url}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </span>
        <div className="text-right">
          <div className="font-semibold text-gray-800">
            {userProfile?.full_name || 'Chưa có tên'}
          </div>
          <div className="text-xs text-gray-500">
            {userProfile?.role || 'Chưa có vai trò'}
          </div>
        </div>
      </div>
      <button className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors duration-200">
        <i className="fa-regular fa-bell"></i>
      </button>
    </div>
  );
}