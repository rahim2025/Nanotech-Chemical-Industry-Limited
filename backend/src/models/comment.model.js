import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        // For logged-in users
        commenter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false // Optional since non-logged users can also comment
        },
        // For non-logged-in users
        commenterName: {
            type: String,
            required: function() {
                return !this.commenter; // Required only if no logged-in user
            },
            trim: true
        },
        email: {
            type: String,
            required: function() {
                return !this.commenter; // Required only if no logged-in user
            },
            trim: true,
            lowercase: true,
            validate: {
                validator: function(email) {
                    if (!this.commenter && email) {
                        // Basic email validation for non-logged users
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                    }
                    return true;
                },
                message: 'Please provide a valid email address'
            }
        },
        commentText: {
            type: String,
            required: true,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },
        adminReply: {
            text: {
                type: String,
                trim: true,
                maxlength: [1000, 'Admin reply cannot exceed 1000 characters']
            },
            repliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            repliedAt: {
                type: Date
            }
        },
        isApproved: {
            type: Boolean,
            default: true // Auto-approve for now, can be changed to false for moderation
        }
    },
    { timestamps: true }
);

// Index for efficient queries
commentSchema.index({ productId: 1, createdAt: -1 });
commentSchema.index({ commenter: 1 });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
