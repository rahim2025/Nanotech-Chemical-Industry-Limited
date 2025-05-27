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
    };    return (
        <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300/50 hover:shadow-md transition-shadow duration-200">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                            <span className="text-xs font-medium">
                                {comment.commenter 
                                    ? comment.commenter.fullName?.charAt(0) 
                                    : comment.commenterName?.charAt(0) || 'U'
                                }
                            </span>
                        </div>
                    </div>                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-sm">
                                {comment.commenter 
                                    ? comment.commenter.fullName 
                                    : comment.commenterName
                                }
                            </h4>
                            {comment.commenter ? (
                                <div className="badge badge-primary badge-xs">Registered</div>
                            ) : (
                                <div className="badge badge-secondary badge-xs">Guest</div>
                            )}
                            {isAdmin && (
                                <div className="badge badge-info badge-xs gap-1">
                                    <Shield size={8} />
                                    Admin
                                </div>
                            )}
                        </div>                        {/* Email display for admins */}
                        {isAdmin && (
                            <div className="flex items-center gap-2 text-xs text-base-content/70 mt-1">
                                <Mail size={12} className="text-primary" />
                                <span className="font-mono text-[10px] bg-base-200 px-1.5 py-0.5 rounded">
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
                                        className="btn btn-xs btn-ghost p-1 h-5 min-h-5 gap-1 hover:bg-primary hover:text-primary-content"
                                        title="Copy email"
                                    >
                                        <Copy size={10} />
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
                                        className="btn btn-xs btn-outline btn-primary p-1 h-5 min-h-5 gap-1"
                                        title="Send email"
                                    >
                                        <Send size={10} />
                                                                            </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-xs text-base-content/60 mt-1">
                            <Calendar size={11} />
                            <span>{formatDate(comment.createdAt)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Admin actions */}
                {isAdmin && (
                    <div className="flex gap-1.5">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="btn btn-xs btn-outline gap-1"
                            title="Reply as Admin"
                        >
                            <Reply size={12} />
                            Reply
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-xs btn-error btn-outline"
                            title="Delete Comment"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Text */}
            <div className="mb-3">
                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap text-sm">
                    {comment.commentText}
                </p>
            </div>            {/* Admin Reply */}
            {comment.adminReply?.text && (
                <div className="bg-base-200/70 rounded-lg p-3 border-l-3 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={14} className="text-primary" />
                        <span className="font-medium text-primary text-sm">Admin Reply</span>
                        <span className="text-xs text-base-content/60">
                            by {comment.adminReply.repliedBy?.fullName || 'Admin'}
                        </span>
                        <span className="text-xs text-base-content/60">•</span>
                        <div className="flex items-center gap-1 text-xs text-base-content/60">
                            <Clock size={10} />
                            <span>{formatDate(comment.adminReply.repliedAt)}</span>
                        </div>
                    </div>
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap text-sm">
                        {comment.adminReply.text}
                    </p>
                </div>
            )}

            {/* Reply Form for Admins */}
            {isAdmin && showReplyForm && !comment.adminReply?.text && (
                <div className="mt-3 bg-base-200/50 rounded-lg p-3 border border-base-300/50">
                    <form onSubmit={handleReply} className="space-y-2.5">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={14} className="text-primary" />
                            <span className="font-medium text-primary text-sm">Reply as Admin</span>
                        </div>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="textarea textarea-bordered textarea-sm w-full min-h-[70px]"
                            placeholder="Write your admin reply..."
                            maxLength={1000}
                            disabled={isSubmittingReply}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-base-content/60">
                                {replyText.length}/1000
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyText("");
                                    }}
                                    className="btn btn-xs btn-outline"
                                    disabled={isSubmittingReply}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-xs btn-primary gap-1"
                                    disabled={isSubmittingReply || !replyText.trim()}
                                >
                                    {isSubmittingReply ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={12} />
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