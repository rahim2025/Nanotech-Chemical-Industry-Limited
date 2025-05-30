import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    subject: {
      type: String,
      required: true,
      enum: ["general", "sales", "support", "partnership", "career", "other"],
      default: "general"
    },
    message: {
      type: String,
      required: true,
      trim: true
    },    status: {
      type: String,
      enum: ["new", "inProgress", "responded", "closed"],
      default: "new"
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isResolved: {
      type: Boolean,
      default: false
    },
    adminNotes: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true 
  }
);

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
