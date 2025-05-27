import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    inquiry: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    inquiryType: {
      type: String,
      enum: ["pricing", "quote", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "inProgress", "responded", "closed"],
      default: "new",
    },
    isResolved: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
