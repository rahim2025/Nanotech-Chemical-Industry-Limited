import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

// Create a notification
export const createNotification = async (notificationData) => {
  try {
    const {
      type,
      title,
      message,
      data = {},
      recipientRole = "admin",
      priority = "medium"
    } = notificationData;

    // Get recipients based on role
    let recipients = [];
    if (recipientRole === "admin") {
      const adminUsers = await User.find({ role: "admin" }).select("_id");
      recipients = adminUsers.map(user => ({ userId: user._id, read: false }));
    } else if (recipientRole === "all") {
      const allUsers = await User.find({}).select("_id");
      recipients = allUsers.map(user => ({ userId: user._id, read: false }));
    }

    const notification = new Notification({
      type,
      title,
      message,
      data,
      recipientRole,
      recipients,
      priority,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = {
      $or: [
        { recipientRole: "all" },
        { recipientRole: req.user.role },
        { "recipients.userId": userId }
      ],
      isActive: true
    };

    if (unreadOnly === "true") {
      query["recipients"] = {
        $elemMatch: {
          userId: userId,
          read: false
        }
      };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add read status for current user
    const notificationsWithReadStatus = notifications.map(notification => {
      const userRecipient = notification.recipients.find(
        r => r.userId.toString() === userId.toString()
      );
      
      return {
        ...notification,
        read: userRecipient ? userRecipient.read : false,
        readAt: userRecipient ? userRecipient.readAt : null
      };
    });

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      "recipients": {
        $elemMatch: {
          userId: userId,
          read: false
        }
      }
    });

    res.status(200).json({
      notifications: notificationsWithReadStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        hasMore: page < Math.ceil(totalNotifications / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Update read status for the user
    const recipientIndex = notification.recipients.findIndex(
      r => r.userId.toString() === userId.toString()
    );

    if (recipientIndex !== -1) {
      notification.recipients[recipientIndex].read = true;
      notification.recipients[recipientIndex].readAt = new Date();
      await notification.save();
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      {
        $or: [
          { recipientRole: "all" },
          { recipientRole: req.user.role },
          { "recipients.userId": userId }
        ],
        "recipients.userId": userId,
        "recipients.read": false,
        isActive: true
      },
      {
        $set: {
          "recipients.$.read": true,
          "recipients.$.readAt": new Date()
        }
      }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Failed to mark all notifications as read" });
  }
};

// Delete notification (admin only)
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isActive: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// Get notification stats (admin only)
export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments({ isActive: true });
    const unreadNotifications = await Notification.countDocuments({
      isActive: true,
      "recipients.read": false
    });
    
    const notificationsByType = await Notification.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const notificationsByPriority = await Notification.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      totalNotifications,
      unreadNotifications,
      notificationsByType,
      notificationsByPriority
    });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    res.status(500).json({ message: "Failed to fetch notification stats" });
  }
};
