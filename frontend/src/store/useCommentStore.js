import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useNotificationStore } from "./useNotificationStore";
import toast from "react-hot-toast";

export const useCommentStore = create((set, get) => ({
    comments: [],
    isLoading: false,
    isSubmitting: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalComments: 0,
        hasMore: false
    },

    // Get comments for a specific product
    getProductComments: async (productId, page = 1) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/comments/product/${productId}?page=${page}&limit=10`);
            
            if (page === 1) {
                set({ 
                    comments: res.data.comments,
                    pagination: res.data.pagination
                });
            } else {
                // Append comments for pagination
                const currentComments = get().comments;
                set({ 
                    comments: [...currentComments, ...res.data.comments],
                    pagination: res.data.pagination
                });
            }
        } catch (error) {
            console.log("Error fetching comments:", error);
            toast.error(error.response?.data?.message || "Failed to fetch comments");
        } finally {
            set({ isLoading: false });
        }
    },    // Create a new comment
    createComment: async (productId, commentData) => {
        set({ isSubmitting: true });
        try {
            const res = await axiosInstance.post(`/comments/product/${productId}`, commentData);
            
            // Add the new comment to the beginning of the list
            const currentComments = get().comments;
            const currentPagination = get().pagination;
            
            set({ 
                comments: [res.data.comment, ...currentComments],
                pagination: {
                    ...currentPagination,
                    totalComments: currentPagination.totalComments + 1
                }
            });
              // Trigger notification for admins
            const { addNotification } = useNotificationStore.getState();
            const commenterName = res.data.comment.commenter 
                ? res.data.comment.commenter.fullName 
                : res.data.comment.commenterName;
            const productName = res.data.comment.productId?.name || 'Unknown Product';
            
            console.log('Adding notification for new comment:', {
                commenterName,
                productName,
                commentId: res.data.comment._id
            });
            
            addNotification({
                type: 'comment',
                title: 'New Comment Posted',
                message: `${commenterName} commented on ${productName}`,
                commentId: res.data.comment._id,
                productId: productId
            });
            
            toast.success(res.data.message);
            return res.data.comment;
        } catch (error) {
            console.log("Error creating comment:", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
            throw error;
        } finally {
            set({ isSubmitting: false });
        }
    },

    // Admin reply to a comment
    replyToComment: async (commentId, replyText) => {
        try {
            const res = await axiosInstance.post(`/comments/${commentId}/reply`, { replyText });
            
            // Update the comment in the list
            const currentComments = get().comments;
            const updatedComments = currentComments.map(comment => 
                comment._id === commentId ? res.data.comment : comment
            );
            
            set({ comments: updatedComments });
            toast.success(res.data.message);
            return res.data.comment;
        } catch (error) {
            console.log("Error replying to comment:", error);
            toast.error(error.response?.data?.message || "Failed to add reply");
            throw error;
        }
    },

    // Delete a comment (admin only)
    deleteComment: async (commentId) => {
        try {
            const res = await axiosInstance.delete(`/comments/${commentId}`);
            
            // Remove the comment from the list
            const currentComments = get().comments;
            const currentPagination = get().pagination;
            const updatedComments = currentComments.filter(comment => comment._id !== commentId);
            
            set({ 
                comments: updatedComments,
                pagination: {
                    ...currentPagination,
                    totalComments: Math.max(0, currentPagination.totalComments - 1)
                }
            });
            
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error deleting comment:", error);
            toast.error(error.response?.data?.message || "Failed to delete comment");
            throw error;
        }
    },

    // Clear comments (useful when navigating away from product)
    clearComments: () => {
        set({ 
            comments: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalComments: 0,
                hasMore: false
            }
        });
    },

    // Get all comments for admin moderation
    getAllComments: async (page = 1, approved = undefined) => {
        set({ isLoading: true });
        try {
            let url = `/comments?page=${page}&limit=20`;
            if (approved !== undefined) {
                url += `&approved=${approved}`;
            }
            
            const res = await axiosInstance.get(url);
            set({ 
                comments: res.data.comments,
                pagination: res.data.pagination
            });
        } catch (error) {
            console.log("Error fetching all comments:", error);
            toast.error(error.response?.data?.message || "Failed to fetch comments");
        } finally {
            set({ isLoading: false });
        }
    },

    // Toggle comment approval (admin only)
    toggleCommentApproval: async (commentId) => {
        try {
            const res = await axiosInstance.patch(`/comments/${commentId}/toggle-approval`);
            
            // Update the comment in the list
            const currentComments = get().comments;
            const updatedComments = currentComments.map(comment => 
                comment._id === commentId ? res.data.comment : comment
            );
            
            set({ comments: updatedComments });
            toast.success(res.data.message);
            return res.data.comment;
        } catch (error) {
            console.log("Error toggling comment approval:", error);
            toast.error(error.response?.data?.message || "Failed to update comment");
            throw error;
        }
    }
}));