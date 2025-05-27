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
    };

    return (
        <div className="bg-base-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">
                    {authUser ? "Leave a Comment" : "Share Your Thoughts"}
                </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* User info for non-logged-in users */}
                {!authUser && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Your Name *</span>
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                <input
                                    type="text"
                                    name="commenterName"
                                    value={formData.commenterName}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Enter your name"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Your Email *</span>
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full pl-10"
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
                    <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                                <span className="text-sm">{authUser.fullName?.charAt(0) || 'U'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{authUser.fullName}</p>
                            <p className="text-sm text-base-content/60">{authUser.email}</p>
                        </div>
                    </div>
                )}
                
                {/* Comment text */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Your Comment *</span>
                        <span className="label-text-alt text-base-content/60">
                            {formData.commentText.length}/1000
                        </span>
                    </label>
                    <textarea
                        name="commentText"
                        value={formData.commentText}
                        onChange={handleInputChange}
                        className="textarea textarea-bordered min-h-[100px] resize-y"
                        placeholder="Share your thoughts about this product..."
                        disabled={isSubmitting}
                        maxLength={1000}
                        required
                    />
                </div>
                
                {/* Submit button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary gap-2"
                        disabled={isSubmitting || !formData.commentText.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Post Comment
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {/* Info message for non-logged users */}
            {!authUser && (
                <div className="alert alert-info mt-4">
                    <div className="text-sm">
                        <strong>Note:</strong> Your email will not be displayed publicly. 
                        It's only used for notifications if we reply to your comment.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentForm;
