import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { MessageCircle, Send, User, Mail } from "lucide-react";
import toast from "react-hot-toast";

const CommentForm = ({ productId }) => {
    const { authUser } = useAuthStore();
    const { createComment, isSubmitting } = useCommentStore();
    const [formData, setFormData] = useState({
        commentText: "",
        commenterName: "",
        email: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.commentText.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        // Validation for non-logged-in users
        if (!authUser) {
            if (!formData.commenterName.trim() || !formData.email.trim()) {
                toast.error("Please enter your name and email");
                return;
            }
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address");
                return;
            }
        }        try {
            const commentData = {
                commentText: formData.commentText.trim()
            };

            // Only add name and email for non-logged-in users
            if (!authUser) {
                commentData.commenterName = formData.commenterName.trim();
                commentData.email = formData.email.trim();
            }

            await createComment(productId, commentData);
            
            // Reset form
            setFormData({
                commentText: "",
                commenterName: "",
                email: ""
            });
        } catch (error) {
            // Error is handled in the store
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };    return (
        <div className="bg-base-200/50 rounded-lg p-4 mb-5 border border-base-300/50">
            <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={16} className="text-primary" />
                <h3 className="text-base font-semibold">
                    {authUser ? "Leave a Comment" : "Share Your Thoughts"}
                </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* User info for non-logged-in users */}
                {!authUser && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-sm">Your Name *</span>
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                <input
                                    type="text"
                                    name="commenterName"
                                    value={formData.commenterName}
                                    onChange={handleInputChange}
                                    className="input input-bordered input-sm w-full pl-10"
                                    placeholder="Enter your name"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text text-sm">Your Email *</span>
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input input-bordered input-sm w-full pl-10"
                                    placeholder="Enter your email"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Logged-in user info display */}
                {authUser && (
                    <div className="flex items-center gap-2 p-2 bg-base-100/70 rounded border border-base-300/50">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-6 h-6">
                                <span className="text-xs">{authUser.fullName?.charAt(0) || 'U'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-sm">{authUser.fullName}</p>
                            <p className="text-xs text-base-content/60">{authUser.email}</p>
                        </div>
                    </div>
                )}
                
                {/* Comment text */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text text-sm">Your Comment *</span>
                        <span className="label-text-alt text-xs text-base-content/60">
                            {formData.commentText.length}/1000
                        </span>
                    </label>
                    <textarea
                        name="commentText"
                        value={formData.commentText}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered textarea-sm min-h-[80px] resize-y text-sm"
                        placeholder="Share your thoughts about this product..."
                        disabled={isSubmitting}
                        maxLength={1000}
                        required
                    />
                </div>
                
                {/* Submit button */}
                <div className="flex justify-between items-center">
                    {/* Info message for non-logged users */}
                    {!authUser && (
                        <div className="text-xs text-base-content/60 max-w-xs">
                            <strong>Note:</strong> Email won't be displayed publicly.
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm gap-2 ml-auto"
                        disabled={isSubmitting || !formData.commentText.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={14} />
                                Post Comment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;