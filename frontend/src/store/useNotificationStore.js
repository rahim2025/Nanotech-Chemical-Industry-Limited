import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    hasMore: false
  },

  // Fetch notifications from backend
  fetchNotifications: async (page = 1, unreadOnly = false) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/notifications?page=${page}&limit=20&unreadOnly=${unreadOnly}`);
      const { notifications, pagination, unreadCount } = response.data;
      
      if (page === 1) {
        set({ 
          notifications,
          pagination,
          unreadCount,
          isLoading: false
        });
      } else {
        // Append for pagination
        set(state => ({ 
          notifications: [...state.notifications, ...notifications],
          pagination,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      set({ isLoading: false });
    }
  },

  // Add a new notification (for real-time updates)
  addNotification: (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);
      
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true, readAt: new Date().toISOString() } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          read: true,
          readAt: new Date().toISOString()
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  // Clear all notifications (frontend only)
  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  // Remove specific notification
  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n._id === id || n.id === id);
      const wasUnread = notification && !notification.read;
      
      return {
        notifications: state.notifications.filter((n) => n._id !== id && n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  // Poll for new notifications (for real-time updates)
  startPolling: () => {
    const pollInterval = setInterval(() => {
      get().fetchNotifications(1, false);
    }, 30000); // Poll every 30 seconds
    
    return pollInterval;
  },

  // Test function for admin dashboard
  addTestNotification: () => {
    const testNotification = {
      type: 'comment',
      title: 'Test Comment Notification',
      message: 'This is a test notification for admin testing',
      commentId: 'test-123',
      productId: 'test-product'
    };
    
    get().addNotification(testNotification);
  },
}));