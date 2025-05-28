import { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Check, X, Mail, MessageSquare, Package, User, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';

const NotificationBell = () => {
  const { authUser } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    isLoading
  } = useNotificationStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, inquiry, comment
  const dropdownRef = useRef(null);

  // Fetch notifications on component mount
  useEffect(() => {
    if (authUser && authUser.role === 'admin') {
      fetchNotifications();
    }
  }, [authUser, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only show for admin users
  if (!authUser || authUser.role !== 'admin') {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inquiry':
        return <Mail size={16} className="text-blue-500" />;
      case 'comment':
        return <MessageSquare size={16} className="text-green-500" />;
      case 'product':
        return <Package size={16} className="text-purple-500" />;
      case 'user':
        return <User size={16} className="text-orange-500" />;
      case 'system':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'inquiry':
        return notifications.filter(n => n.type === 'inquiry');
      case 'comment':
        return notifications.filter(n => n.type === 'comment');
      default:
        return notifications;
    }
  };
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id || notification.id);
    }
    // Just mark as read, no navigation
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle relative"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="text-primary animate-pulse" />
        ) : (
          <Bell size={20} />
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-error text-error-content rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-base">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1 bg-base-200 rounded-md p-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'inquiry', label: 'Inquiries' },
                { key: 'comment', label: 'Comments' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    filter === key 
                      ? 'bg-primary text-primary-content' 
                      : 'hover:bg-base-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <span className="loading loading-spinner loading-sm"></span>
                <p className="text-sm text-base-content/70 mt-2">Loading...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-base-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification._id || notification.id}
                    className={`p-3 hover:bg-base-200/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification._id || notification.id);
                            }}
                            className="text-base-content/50 hover:text-error transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-base-content/50">
                            {formatTimeAgo(notification.createdAt || notification.timestamp)}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-base-content/30 mb-3" />
                <p className="text-sm text-base-content/70">
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'inquiry' ? 'No inquiry notifications' :
                   filter === 'comment' ? 'No comment notifications' :
                   'No notifications yet'}
                </p>              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
