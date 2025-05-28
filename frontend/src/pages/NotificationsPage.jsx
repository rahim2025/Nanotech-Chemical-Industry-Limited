import { useState, useEffect } from 'react';
import { Bell, Filter, Trash2, Eye, EyeOff, MoreHorizontal, Mail, MessageSquare, Package, User, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    isLoading,
    pagination
  } = useNotificationStore();

  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  useEffect(() => {
    if (authUser && authUser.role === 'admin') {
      fetchNotifications();
    } else {
      navigate('/'); // Redirect non-admin users
    }
  }, [authUser, navigate, fetchNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'inquiry':
        return <Mail size={20} className="text-blue-500" />;
      case 'comment':
        return <MessageSquare size={20} className="text-green-500" />;
      case 'product':
        return <Package size={20} className="text-purple-500" />;
      case 'user':
        return <User size={20} className="text-orange-500" />;
      case 'system':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
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
      case 'product':
        return notifications.filter(n => n.type === 'product');
      case 'user':
        return notifications.filter(n => n.type === 'user');
      case 'system':
        return notifications.filter(n => n.type === 'system');
      default:
        return notifications;
    }
  };
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    // Just mark as read, no navigation
  };

  const handleSelectNotification = (notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleBulkAction = (action) => {
    selectedNotifications.forEach(notificationId => {
      if (action === 'read') {
        const notification = notifications.find(n => n._id === notificationId);
        if (notification && !notification.read) {
          markAsRead(notificationId);
        }
      } else if (action === 'delete') {
        removeNotification(notificationId);
      }
    });
    setSelectedNotifications(new Set());
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-info';
      case 'low':
        return 'text-success';
      default:
        return 'text-base-content';
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (!authUser || authUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-base-100 rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-base-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Bell className="text-primary" />
                Notifications
              </h1>
              <p className="text-base-content/70 mt-1">
                Manage your notifications and stay updated with system activities
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="stats shadow-sm">
                <div className="stat">
                  <div className="stat-title text-xs">Total</div>
                  <div className="stat-value text-lg">{notifications.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title text-xs">Unread</div>
                  <div className="stat-value text-lg text-primary">{unreadCount}</div>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <Eye size={16} />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-base-200 bg-base-50">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-base-content/70" />
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'inquiry', label: 'Inquiries', count: notifications.filter(n => n.type === 'inquiry').length },
                { key: 'comment', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
                { key: 'product', label: 'Products', count: notifications.filter(n => n.type === 'product').length },
                { key: 'user', label: 'Users', count: notifications.filter(n => n.type === 'user').length },
                { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`btn btn-sm ${
                    filter === key ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span className="badge badge-sm ml-2">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {selectedNotifications.size} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('read')}
                  className="btn btn-xs btn-outline gap-1"
                >
                  <Eye size={12} />
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn btn-xs btn-outline btn-error gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-base-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70 mt-4">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-base-50 transition-colors ${
                  !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm mt-1"
                    checked={selectedNotifications.has(notification._id)}
                    onChange={() => handleSelectNotification(notification._id)}
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <span className={`badge badge-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-base-content/70 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-base-content/50">
                          <span>{formatDateTime(notification.createdAt)}</span>
                          <span className="capitalize">{notification.type}</span>
                          {notification.data?.customerName && (
                            <span>From: {notification.data.customerName}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="btn btn-xs btn-ghost gap-1"
                            title="Mark as read"
                          >
                            <Eye size={12} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removeNotification(notification._id)}
                          className="btn btn-xs btn-ghost text-error gap-1"
                          title="Delete notification"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell size={48} className="mx-auto text-base-content/30 mb-4" />
              <h3 className="text-lg font-medium text-base-content/70 mb-2">
                No notifications found
              </h3>
              <p className="text-base-content/50">
                {filter === 'unread' ? 'You have no unread notifications' :
                 filter === 'inquiry' ? 'No inquiry notifications' :
                 filter === 'comment' ? 'No comment notifications' :
                 'No notifications yet'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.hasMore && (
          <div className="p-6 border-t border-base-200">
            <div className="flex justify-center">
              <button
                onClick={() => fetchNotifications(pagination.currentPage + 1)}
                className="btn btn-outline"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
