import Comment from "../models/comment.model.js";
import Product from "../models/product.model.js";

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { productId } = req.params;
        const { commentText, commenterName, email } = req.body;
        const userId = req.user?._id; // Optional, might be null for non-logged users

        // Validate required fields
        if (!commentText || commentText.trim().length === 0) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Validate for non-logged-in users
        if (!userId) {
            if (!commenterName || !email) {
                return res.status(400).json({
                    message: "Name and email are required for non-registered users"
                });
            }
        }

        // Create comment data
        const commentData = {
            productId,
            commentText: commentText.trim()
        };

        // Add user data based on authentication status
        if (userId) {
            commentData.commenter = userId;
        } else {
            commentData.commenterName = commenterName.trim();
            commentData.email = email.trim().toLowerCase();
        }

        const newComment = new Comment(commentData);
        await newComment.save();

        // Populate the comment with user data if needed
        await newComment.populate('commenter', 'fullName email');
        await newComment.populate('productId', 'name');

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (error) {
        console.error("Error in createComment controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all comments for a product
export const getProductComments = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const skip = (page - 1) * limit;

        const comments = await Comment.find({ 
            productId, 
            isApproved: true 
        })
        .populate('commenter', 'fullName email')
        .populate('adminReply.repliedBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const totalComments = await Comment.countDocuments({ 
            productId, 
            isApproved: true 
        });

        res.status(200).json({
            comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasMore: skip + comments.length < totalComments
            }
        });

    } catch (error) {
        console.error("Error in getProductComments controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Admin reply to a comment
export const replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { replyText } = req.body;
        const adminId = req.user._id;

        if (!replyText || replyText.trim().length === 0) {
            return res.status(400).json({
                message: "Reply text is required"
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Update the comment with admin reply
        comment.adminReply = {
            text: replyText.trim(),
            repliedBy: adminId,
            repliedAt: new Date()
        };

        await comment.save();
        await comment.populate('commenter', 'fullName email');
        await comment.populate('adminReply.repliedBy', 'fullName');

        res.status(200).json({
            message: "Reply added successfully",
            comment
        });

    } catch (error) {
        console.error("Error in replyToComment controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Delete a comment (admin only)
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteComment controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Get all comments (admin only - for moderation)
export const getAllComments = async (req, res) => {
    try {
        const { page = 1, limit = 20, approved } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (approved !== undefined) {
            filter.isApproved = approved === 'true';
        }

        const comments = await Comment.find(filter)
            .populate('commenter', 'fullName email')
            .populate('productId', 'name')
            .populate('adminReply.repliedBy', 'fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalComments = await Comment.countDocuments(filter);

        res.status(200).json({
            comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasMore: skip + comments.length < totalComments
            }
        });

    } catch (error) {
        console.error("Error in getAllComments controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Toggle comment approval (admin only)
export const toggleCommentApproval = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        comment.isApproved = !comment.isApproved;
        await comment.save();

        await comment.populate('commenter', 'fullName email');
        await comment.populate('productId', 'name');

        res.status(200).json({
            message: `Comment ${comment.isApproved ? 'approved' : 'disapproved'} successfully`,
            comment
        });

    } catch (error) {
        console.error("Error in toggleCommentApproval controller:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
