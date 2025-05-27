import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { 
    User, 
    Calendar, 
    Reply, 
    Trash2, 
    Shield,
    Send,
    Clock,
    Mail,
    Copy
} from "lucide-react";
import toast from "react-hot-toast";

const CommentItem = ({ comment }) => {
    const { authUser } = useAuthStore();
    const { replyToComment, deleteComment } = useCommentStore();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const isAdmin = authUser?.role === "admin";

    const handleReply = async (e) => {
        e.preventDefault();
        
        if (!replyText.trim()) {
            toast.error("Please enter a reply");
            return;
        }

        setIsSubmittingReply(true);
        try {
            await replyToComment(comment._id, replyText.trim());
            setReplyText("");
            setShowReplyForm(false);
        } catch (error) {
            // Error is handled in the store
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
            try {
                await deleteComment(comment._id);
            } catch (error) {
                // Error is handled in the store
            }
        }
    };

    const handleSendEmail = (email, commenterName) => {
        const subject = encodeURIComponent(`Re: Your comment on our product`);
        const body = encodeURIComponent(`Hi ${commenterName},\n\nThank you for your comment on our product. We appreciate your feedback!\n\nBest regards,\nNanotech Chemical Team`);
        const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    };

    const handleCopyEmail = async (email) => {
        try {
            await navigator.clipboard.writeText(email);
            toast.success("Email copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy email");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm">
                                {comment.commenter 
                                    ? comment.commenter.fullName?.charAt(0) 
                                    : comment.commenterName?.charAt(0) || 'U'
                                }
                            </span>
                        </div>
                    </div>                    <div>                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                                {comment.commenter 
                                    ? comment.commenter.fullName 
                                    : comment.commenterName
                                }
                            </h4>
                            {comment.commenter ? (
                                <div className="badge badge-primary badge-sm">Registered User</div>
                            ) : (
                                <div className="badge badge-secondary badge-sm">Guest User</div>
                            )}
                            {isAdmin && (
                                <div className="badge badge-info badge-sm">
                                    <Shield size={10} className="mr-1" />
                                    Admin View
                                </div>
                            )}
                        </div>                        {/* Email display for admins */}
                        {isAdmin && (
                            <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
                                <Mail size={14} className="text-primary" />
                                <span className="font-medium">Email: </span>
                                <span className="text-base-content/80 font-mono text-xs bg-base-200 px-2 py-1 rounded">
                                    {comment.commenter 
                                        ? comment.commenter.email 
                                        : comment.email
                                    }
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleCopyEmail(
                                            comment.commenter 
                                                ? comment.commenter.email 
                                                : comment.email
                                        )}
                                        className="btn btn-xs btn-ghost gap-1 hover:bg-primary hover:text-primary-content"
                                        title="Copy email to clipboard"
                                    >
                                        <Copy size={12} />
                                        Copy
                                    </button>
                                    <button
                                        onClick={() => handleSendEmail(
                                            comment.commenter 
                                                ? comment.commenter.email 
                                                : comment.email,
                                            comment.commenter 
                                                ? comment.commenter.fullName 
                                                : comment.commenterName
                                        )}
                                        className="btn btn-xs btn-outline btn-primary gap-1"
                                        title="Send email to commenter"
                                    >
                                        <Send size={12} />
                                        Email
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                            <Calendar size={14} />
                            <span>{formatDate(comment.createdAt)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Admin actions */}
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="btn btn-sm btn-outline gap-2"
                            title="Reply as Admin"
                        >
                            <Reply size={14} />
                            Reply
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-sm btn-error btn-outline"
                            title="Delete Comment"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Text */}
            <div className="mb-4">
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                    {comment.commentText}
                </p>
            </div>

            {/* Admin Reply */}
            {comment.adminReply?.text && (
                <div className="bg-base-200 rounded-lg p-4 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-primary" />
                        <span className="font-semibold text-primary">Admin Reply</span>
                        <span className="text-sm text-base-content/60">
                            by {comment.adminReply.repliedBy?.fullName || 'Admin'}
                        </span>
                        <span className="text-sm text-base-content/60">•</span>
                        <div className="flex items-center gap-1 text-sm text-base-content/60">
                            <Clock size={12} />
                            <span>{formatDate(comment.adminReply.repliedAt)}</span>
                        </div>
                    </div>
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                        {comment.adminReply.text}
                    </p>
                </div>
            )}

            {/* Reply Form for Admins */}
            {isAdmin && showReplyForm && !comment.adminReply?.text && (
                <div className="mt-4 bg-base-200 rounded-lg p-4">
                    <form onSubmit={handleReply} className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={16} className="text-primary" />
                            <span className="font-semibold text-primary">Reply as Admin</span>
                        </div>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            placeholder="Write your admin reply..."
                            rows={3}
                            maxLength={1000}
                            disabled={isSubmittingReply}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-base-content/60">
                                {replyText.length}/1000
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyText("");
                                    }}
                                    className="btn btn-sm btn-outline"
                                    disabled={isSubmittingReply}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-primary gap-2"
                                    disabled={isSubmittingReply || !replyText.trim()}
                                >
                                    {isSubmittingReply ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CommentItem;
