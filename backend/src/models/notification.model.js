import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["inquiry", "comment", "user", "product", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    recipientRole: {
      type: String,
      enum: ["admin", "user", "all"],
      default: "admin",
    },
    recipients: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      read: {
        type: Boolean,
        default: false,
      },
      readAt: {
        type: Date,
      }
    }],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  },
  { 
    timestamps: true,
    indexes: [
      { recipientRole: 1, isActive: 1, createdAt: -1 },
      { "recipients.userId": 1, "recipients.read": 1 },
      { expiresAt: 1 }, // For TTL cleanup
    ]
  }
);

// Automatically remove expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
