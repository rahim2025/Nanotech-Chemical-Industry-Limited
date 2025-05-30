import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { useNotificationStore } from "../store/useNotificationStore";
import useCareerStore from "../store/useCareerStore";
import useContactStore from "../store/useContactStore";
import { Users, Shield, ShieldOff, Trash2, User, Crown, Package, Plus, Edit, BarChart3, Eye, MessageCircle, Calendar, Mail, Reply, Briefcase, Clock, Phone } from "lucide-react";
import AddProductForm from "../components/AddProductForm";
import CommentItem from "../components/CommentItem";
import CareerForm from "../components/CareerForm";

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();    const { users, isLoading, getAllUsers, promoteToAdmin, demoteToUser, deleteUser } = useAdminStore();
    const { products, getAllProducts, deleteProduct } = useProductStore();
    const { authUser } = useAuthStore();
    const { 
        comments, 
        isLoading: isLoadingComments, 
        getAllComments, 
        deleteComment, 
        replyToComment,
        pagination: commentPagination 
    } = useCommentStore();
    const { 
        careers, 
        isLoading: isLoadingCareers, 
        fetchAllCareersAdmin, 
        deleteCareer, 
        toggleCareerStatus 
    } = useCareerStore();
    
    const { 
        contacts, 
        isLoading: isLoadingContacts, 
        getAllContacts, 
        deleteContact,
        markContactAsRead 
    } = useContactStore();
    
    const [filter, setFilter] = useState("all");
    
    // Get tab from URL params or default to "users"
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab');    const [activeTab, setActiveTab] = useState(tabFromUrl || "users");
    
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [commentFilter, setCommentFilter] = useState("all");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [showCareerForm, setShowCareerForm] = useState(false);
    const [editingCareer, setEditingCareer] = useState(null);
    const [contactFilter, setContactFilter] = useState("all");

    useEffect(() => {
        getAllUsers();
        getAllProducts();
        getAllComments();
        fetchAllCareersAdmin();
        getAllContacts();
    }, [getAllUsers, getAllProducts, getAllComments, fetchAllCareersAdmin, getAllContacts]);    // Update active tab when URL changes
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && ['users', 'products', 'comments', 'inquiries', 'careers', 'contacts'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [location.search]);// Handle tab change with URL update
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tab', tab);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    // Comment management functions
    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
            await deleteComment(commentId);
        }
    };

    const handleReplyToComment = async (commentId, replyText) => {
        try {
            await replyToComment(commentId, replyText);
            setReplyingTo(null);
            setReplyText("");
        } catch (error) {
            // Error is handled in the store
        }
    };

    // Filter comments based on selected filter
    const filteredComments = comments.filter(comment => {
        if (commentFilter === "all") return true;
        if (commentFilter === "replied") return comment.adminReply?.text;
        if (commentFilter === "unreplied") return !comment.adminReply?.text;
        if (commentFilter === "guests") return !comment.commenter;
        if (commentFilter === "users") return comment.commenter;
        return true;
    });

    // Career management functions
    const handleDeleteCareer = async (careerId) => {
        if (window.confirm("Are you sure you want to delete this career post? This action cannot be undone.")) {
            await deleteCareer(careerId);
        }
    };

    const handleToggleCareerStatus = async (careerId) => {
        await toggleCareerStatus(careerId);
    };

    const handleEditCareer = (career) => {
        setEditingCareer(career);
        setShowCareerForm(true);
    };

    const handleCareerFormClose = () => {
        setShowCareerForm(false);
        setEditingCareer(null);
    };

    const handleCareerFormSuccess = () => {
        // Refresh career list is handled by the store
        handleCareerFormClose();
    };

    // Contact management functions
    const handleDeleteContact = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact message? This action cannot be undone.")) {
            await deleteContact(contactId);
        }
    };

    const handleMarkAsRead = async (contactId) => {
        await markContactAsRead(contactId);
    };

    // Filter contacts based on selected filter
    const filteredContacts = contacts?.filter(contact => {
        if (contactFilter === "all") return true;
        if (contactFilter === "read") return contact.isRead;
        if (contactFilter === "unread") return !contact.isRead;
        return true;
    }) || [];// Helper function to format pricing
    const formatPrice = (price) => {
        if (!price) return "Contact for pricing";
        
        const currencySymbol = {
            USD: "$",
            EUR: "€", 
            GBP: "£"
        }[price.currency] || price.currency;

        try {
            // Check if contact for pricing is enabled
            if (price.contactForPrice) {
                return "Contact for pricing";
            }

            // Check if we have minimum value
            if (price.minValue === undefined || price.minValue === null) {
                return "Contact for pricing";
            }

            // If we have both min and max values, it's a range
            if (price.maxValue !== undefined && price.maxValue !== null && price.maxValue !== "") {
                return `${currencySymbol}${Number(price.minValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} - ${currencySymbol}${Number(price.maxValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${price.unit || ''}`;
            } else {
                // Single price
                return `${currencySymbol}${Number(price.minValue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${price.unit || ''}`;
            }
        } catch (error) {
            console.error("Error formatting price:", error, price);
            return "Contact for pricing";
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === "all") return true;
        return user.role === filter;
    });

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(productId);
        }
    };

    const handlePromote = async (userId) => {
        if (window.confirm("Are you sure you want to promote this user to admin?")) {
            await promoteToAdmin(userId);
        }
    };

    const handleDemote = async (userId) => {
        if (window.confirm("Are you sure you want to demote this admin to user?")) {
            await demoteToUser(userId);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            await deleteUser(userId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }    return (
        <div className="container mx-auto p-6 min-h-screen bg-base-200 pt-20">
            <div className="bg-base-100 rounded-lg shadow-lg p-6">                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="stat bg-primary text-primary-content rounded-lg">
                        <div className="stat-figure">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-primary-content/80">Total Users</div>
                        <div className="stat-value">{users.length}</div>
                        <div className="stat-desc text-primary-content/60">
                            {users.filter(u => u.role === "admin").length} admins
                        </div>
                    </div>
                    
                    <div className="stat bg-secondary text-secondary-content rounded-lg">
                        <div className="stat-figure">
                            <Package className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-secondary-content/80">Total Products</div>
                        <div className="stat-value">{products.length}</div>
                        <div className="stat-desc text-secondary-content/60">
                            {products.filter(p => p.inStock).length} in stock
                        </div>
                    </div>

                    <div className="stat bg-accent text-accent-content rounded-lg">
                        <div className="stat-figure">
                            <MessageCircle className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-accent-content/80">Total Comments</div>
                        <div className="stat-value">{comments.length}</div>
                        <div className="stat-desc text-accent-content/60">
                            {comments.filter(c => !c.adminReply?.text).length} pending replies
                        </div>
                    </div>

                    <div className="stat bg-info text-info-content rounded-lg">
                        <div className="stat-figure">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-info-content/80">Career Posts</div>
                        <div className="stat-value">{careers.length}</div>
                        <div className="stat-desc text-info-content/60">
                            {careers.filter(c => c.isActive).length} active positions
                        </div>
                    </div>

                    <div className="stat bg-emerald-600 text-white rounded-lg">
                        <div className="stat-figure">
                            <Phone className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-white/80">Contact Messages</div>
                        <div className="stat-value">{contacts?.length || 0}</div>
                        <div className="stat-desc text-white/60">
                            {contacts?.filter(c => !c.isRead).length || 0} unread
                        </div>
                    </div>
                </div>                {/* Tab Navigation */}
                <div className="tabs tabs-boxed mb-6">
                    <button
                        onClick={() => handleTabChange("users")}
                        className={`tab gap-2 ${activeTab === "users" ? "tab-active" : ""}`}
                    >
                        <Users className="w-4 h-4" />
                        User Management
                    </button>
                    <button
                        onClick={() => handleTabChange("products")}
                        className={`tab gap-2 ${activeTab === "products" ? "tab-active" : ""}`}
                    >
                        <Package className="w-4 h-4" />
                        Product Management
                    </button>
                    <button
                        onClick={() => handleTabChange("careers")}
                        className={`tab gap-2 ${activeTab === "careers" ? "tab-active" : ""}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Career Management
                    </button>
                    <button
                        onClick={() => handleTabChange("contacts")}
                        className={`tab gap-2 ${activeTab === "contacts" ? "tab-active" : ""}`}
                    >
                        <Phone className="w-4 h-4" />
                        Contact Messages
                        {contacts?.filter(c => !c.isRead).length > 0 && (
                            <div className="badge badge-error badge-sm">
                                {contacts?.filter(c => !c.isRead).length}
                            </div>
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange("comments")}
                        className={`tab gap-2 ${activeTab === "comments" ? "tab-active" : ""}`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Comments Management
                        {comments.filter(c => !c.adminReply?.text).length > 0 && (
                            <div className="badge badge-error badge-sm">
                                {comments.filter(c => !c.adminReply?.text).length}
                            </div>
                        )}
                    </button>
                    <Link
                        to="/admin/inquiries"
                        className="tab gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Product Inquiries
                    </Link>
                </div>

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div>
                        {/* Filter Controls */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setFilter("all")}
                                className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                All Users ({users.length})
                            </button>
                            <button
                                onClick={() => setFilter("user")}
                                className={`btn ${filter === "user" ? "btn-primary" : "btn-outline"}`}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Users ({users.filter(u => u.role === "user").length})
                            </button>
                            <button
                                onClick={() => setFilter("admin")}
                                className={`btn ${filter === "admin" ? "btn-primary" : "btn-outline"}`}
                            >
                                <Crown className="w-4 h-4 mr-2" />
                                Admins ({users.filter(u => u.role === "admin").length})
                            </button>
                        </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={user.profilePic || "/avatar.png"}
                                                        alt={user.fullName}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.fullName}</div>
                                                {user._id === authUser?._id && (
                                                    <div className="text-sm opacity-50">You</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className={`badge ${user.role === "admin" ? "badge-error" : "badge-info"}`}>
                                            {user.role === "admin" ? (
                                                <>
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    Admin
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-3 h-3 mr-1" />
                                                    User
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            {user.role === "user" && (
                                                <button
                                                    onClick={() => handlePromote(user._id)}
                                                    className="btn btn-sm btn-success"
                                                    title="Promote to Admin"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user.role === "admin" && user._id !== authUser?._id && (
                                                <button
                                                    onClick={() => handleDemote(user._id)}
                                                    className="btn btn-sm btn-warning"
                                                    title="Demote to User"
                                                >
                                                    <ShieldOff className="w-4 h-4" />
                                                </button>
                                            )}
                                            {user._id !== authUser?._id && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-sm btn-error"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="w-16 h-16 mx-auto text-base-300 mb-4" />
                                <p className="text-lg text-base-content/60">
                                    No {filter === "all" ? "" : filter + " "}users found
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Product Management</h2>
                            <button
                                onClick={() => setShowAddProductForm(true)}
                                className="btn btn-primary gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Product
                            </button>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <Package className="w-16 h-16 mx-auto text-base-300 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                                <p className="text-base-content/60 mb-6">Add your first product to get started!</p>
                                <button
                                    onClick={() => setShowAddProductForm(true)}
                                    className="btn btn-primary gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add First Product
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="card bg-base-100 shadow-xl border">                                        <figure className="h-48 overflow-hidden">
                                            <Link to={`/products/${product._id}`}>
                                                <img
                                                    src={product.photo || "/api/placeholder/400/300"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                />
                                            </Link>
                                        </figure>                                        <div className="card-body">
                                            <Link to={`/products/${product._id}`}>
                                                <h2 className="card-title hover:text-primary transition-colors cursor-pointer">
                                                    {product.name}
                                                </h2>
                                            </Link>
                                            <p className="text-sm text-base-content/70 line-clamp-2">
                                                {product.description}
                                            </p>                                            {/* Pricing Information */}
                                            <div className="mt-2 p-2 bg-base-200 rounded-lg">
                                                <div className="text-xs text-base-content/60 uppercase tracking-wide">Price</div>
                                                <div className="text-base font-bold" style={{ 
                                                    color: '#0d47a1', 
                                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                                    padding: '3px 6px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    {formatPrice(product.price)}
                                                </div>
                                            </div>
                                              <div className="flex items-center justify-between mt-4">
                                                <div className={`badge ${product.inStock ? 'badge-success' : 'badge-error'}`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        className="btn btn-sm btn-primary"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setEditingProduct(product)}
                                                        className="btn btn-sm btn-warning"
                                                        title="Edit Product"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="btn btn-sm btn-error"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>                )}

                {/* Comments Tab */}
                {activeTab === "comments" && (
                    <div>                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Comments Management</h2>
                            <div className="flex items-center gap-4">
                               
                                <div className="stats stats-horizontal">
                                    <div className="stat">
                                        <div className="stat-title">Total Comments</div>
                                        <div className="stat-value text-lg">{comments.length}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Pending Replies</div>
                                        <div className="stat-value text-lg text-warning">
                                            {comments.filter(c => !c.adminReply?.text).length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment Filter Controls */}
                        <div className="flex gap-4 mb-6 flex-wrap">
                            <button
                                onClick={() => setCommentFilter("all")}
                                className={`btn ${commentFilter === "all" ? "btn-primary" : "btn-outline"}`}
                            >
                                All Comments ({comments.length})
                            </button>
                            <button
                                onClick={() => setCommentFilter("unreplied")}
                                className={`btn ${commentFilter === "unreplied" ? "btn-primary" : "btn-outline"}`}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Pending Replies ({comments.filter(c => !c.adminReply?.text).length})
                            </button>
                            <button
                                onClick={() => setCommentFilter("replied")}
                                className={`btn ${commentFilter === "replied" ? "btn-primary" : "btn-outline"}`}
                            >
                                <Reply className="w-4 h-4 mr-2" />
                                Replied ({comments.filter(c => c.adminReply?.text).length})
                            </button>
                            <button
                                onClick={() => setCommentFilter("guests")}
                                className={`btn ${commentFilter === "guests" ? "btn-primary" : "btn-outline"}`}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Guest Users ({comments.filter(c => !c.commenter).length})
                            </button>
                            <button
                                onClick={() => setCommentFilter("users")}
                                className={`btn ${commentFilter === "users" ? "btn-primary" : "btn-outline"}`}
                            >
                                <Crown className="w-4 h-4 mr-2" />
                                Registered Users ({comments.filter(c => c.commenter).length})
                            </button>
                        </div>

                        {/* Comments List */}
                        {isLoadingComments ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="loading loading-spinner loading-lg"></div>
                            </div>
                        ) : filteredComments.length === 0 ? (
                            <div className="text-center py-16">
                                <MessageCircle className="w-16 h-16 mx-auto text-base-300 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No comments found</h3>
                                <p className="text-base-content/60">
                                    {commentFilter === "all" 
                                        ? "No comments have been posted yet." 
                                        : `No ${commentFilter} comments found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredComments.map((comment) => (
                                    <div key={comment._id} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
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
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
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
                                                        {!comment.adminReply?.text && (
                                                            <div className="badge badge-warning badge-sm">
                                                                <MessageCircle size={10} className="mr-1" />
                                                                Needs Reply
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Email and Product Info */}
                                                    <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <Mail size={12} className="text-primary" />
                                                            <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                                                                {comment.commenter 
                                                                    ? comment.commenter.email 
                                                                    : comment.email
                                                                }
                                                            </span>
                                                        </div>
                                                        {comment.productId && (
                                                            <div className="flex items-center gap-1">
                                                                <Package size={12} className="text-secondary" />
                                                                <span className="text-secondary font-medium">
                                                                    {comment.productId.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {!comment.adminReply?.text && (
                                                    <button
                                                        onClick={() => setReplyingTo(
                                                            replyingTo === comment._id ? null : comment._id
                                                        )}
                                                        className="btn btn-sm btn-primary gap-2"
                                                    >
                                                        <Reply size={14} />
                                                        Reply
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="btn btn-sm btn-error btn-outline"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comment Text */}
                                        <div className="mb-4">
                                            <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap bg-base-200 p-4 rounded-lg">
                                                {comment.commentText}
                                            </p>
                                        </div>

                                        {/* Admin Reply */}
                                        {comment.adminReply?.text && (
                                            <div className="bg-primary/10 rounded-lg p-4 border-l-4 border-primary">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Shield size={16} className="text-primary" />
                                                    <span className="font-semibold text-primary">Admin Reply</span>
                                                    <span className="text-sm text-base-content/60">
                                                        by {comment.adminReply.repliedBy?.fullName || 'Admin'}
                                                    </span>
                                                    <span className="text-sm text-base-content/60">•</span>
                                                    <span className="text-sm text-base-content/60">
                                                        {new Date(comment.adminReply.repliedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                                                    {comment.adminReply.text}
                                                </p>
                                            </div>
                                        )}

                                        {/* Reply Form */}
                                        {replyingTo === comment._id && !comment.adminReply?.text && (
                                            <div className="mt-4 bg-base-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Shield size={16} className="text-primary" />
                                                    <span className="font-semibold text-primary">Reply as Admin</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="textarea textarea-bordered w-full"
                                                        placeholder="Write your admin reply..."
                                                        rows={3}
                                                        maxLength={1000}
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-base-content/60">
                                                            {replyText.length}/1000
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setReplyingTo(null);
                                                                    setReplyText("");
                                                                }}
                                                                className="btn btn-sm btn-outline"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleReplyToComment(comment._id, replyText)}
                                                                className="btn btn-sm btn-primary gap-2"
                                                                disabled={!replyText.trim()}
                                                            >
                                                                <Reply size={14} />
                                                                Send Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Careers Tab */}
                {activeTab === "careers" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Career Management</h2>
                            <button
                                onClick={() => setShowCareerForm(true)}
                                className="btn btn-primary gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Career Post
                            </button>
                        </div>

                        {isLoadingCareers ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="loading loading-spinner loading-lg"></div>
                            </div>
                        ) : careers.length === 0 ? (
                            <div className="text-center py-16">
                                <Briefcase className="w-16 h-16 mx-auto text-base-300 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No career posts yet</h3>
                                <p className="text-base-content/60 mb-6">Add your first career opportunity to get started!</p>
                                <button
                                    onClick={() => setShowCareerForm(true)}
                                    className="btn btn-primary gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add First Career Post
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {careers.map((career) => (
                                    <div key={career._id} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-300">
                                        {/* Career Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-primary">{career.title}</h3>
                                                    <div className={`badge ${career.isActive ? 'badge-success' : 'badge-error'}`}>
                                                        {career.isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                    {career.applicationDeadline && new Date(career.applicationDeadline) < new Date() && (
                                                        <div className="badge badge-warning">Expired</div>
                                                    )}
                                                </div>
                                                <p className="text-base-content/80 mb-3">{career.description}</p>
                                                
                                                <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                                                    <div className="flex items-center gap-1">
                                                        <Package className="w-4 h-4 text-secondary" />
                                                        <span>{career.department}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-4 h-4 text-accent" />
                                                        <span>{career.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-info" />
                                                        <span>{career.jobType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BarChart3 className="w-4 h-4 text-warning" />
                                                        <span>{career.experienceLevel}</span>
                                                    </div>
                                                    {career.applicationDeadline && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4 text-error" />
                                                            <span>Deadline: {new Date(career.applicationDeadline).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleCareerStatus(career._id)}
                                                    className={`btn btn-sm ${career.isActive ? 'btn-warning' : 'btn-success'}`}
                                                    title={career.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {career.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleEditCareer(career)}
                                                    className="btn btn-sm btn-primary"
                                                    title="Edit Career"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCareer(career._id)}
                                                    className="btn btn-sm btn-error"
                                                    title="Delete Career"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Career Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-base-300">
                                            {career.requirements && career.requirements.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-sm text-base-content/80 mb-2">Requirements</h4>
                                                    <ul className="text-sm space-y-1">
                                                        {career.requirements.slice(0, 3).map((req, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                                <span className="text-base-content/70">{req}</span>
                                                            </li>
                                                        ))}
                                                        {career.requirements.length > 3 && (
                                                            <li className="text-sm text-base-content/60">
                                                                +{career.requirements.length - 3} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {career.responsibilities && career.responsibilities.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-sm text-base-content/80 mb-2">Responsibilities</h4>
                                                    <ul className="text-sm space-y-1">
                                                        {career.responsibilities.slice(0, 3).map((resp, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                                <span className="text-base-content/70">{resp}</span>
                                                            </li>
                                                        ))}
                                                        {career.responsibilities.length > 3 && (
                                                            <li className="text-sm text-base-content/60">
                                                                +{career.responsibilities.length - 3} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="font-semibold text-sm text-base-content/80 mb-2">Details</h4>
                                                <div className="text-sm space-y-1">
                                                    {career.salary && (career.salary.min || career.salary.max) && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base-content/60">Salary:</span>
                                                            <span className="text-base-content/80 font-medium">
                                                                {career.salary.currency} {career.salary.min ? career.salary.min.toLocaleString() : ''} 
                                                                {career.salary.min && career.salary.max ? ' - ' : ''}
                                                                {career.salary.max ? career.salary.max.toLocaleString() : ''}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base-content/60">Posted:</span>
                                                        <span className="text-base-content/80">{new Date(career.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base-content/60">By:</span>
                                                        <span className="text-base-content/80">{career.postedBy?.username || 'Admin'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Contact Messages Tab */}
                {activeTab === "contacts" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Contact Messages</h2>
                            
                            {/* Filter Controls */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setContactFilter("all")}
                                    className={`btn btn-sm ${contactFilter === "all" ? "btn-primary" : "btn-outline"}`}
                                >
                                    All ({contacts?.length || 0})
                                </button>
                                <button
                                    onClick={() => setContactFilter("unread")}
                                    className={`btn btn-sm ${contactFilter === "unread" ? "btn-primary" : "btn-outline"}`}
                                >
                                    Unread ({contacts?.filter(c => !c.isRead).length || 0})
                                </button>
                                <button
                                    onClick={() => setContactFilter("read")}
                                    className={`btn btn-sm ${contactFilter === "read" ? "btn-primary" : "btn-outline"}`}
                                >
                                    Read ({contacts?.filter(c => c.isRead).length || 0})
                                </button>
                            </div>
                        </div>

                        {isLoadingContacts ? (
                            <div className="flex justify-center py-8">
                                <div className="loading loading-spinner loading-lg"></div>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="text-center py-12">
                                <Phone className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Contact Messages</h3>
                                <p className="text-gray-400">No contact messages found matching your filter.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className={`card shadow-lg transition-all duration-200 hover:shadow-xl ${
                                            contact.isRead ? 'bg-base-100' : 'bg-blue-50 border-l-4 border-l-blue-500'
                                        }`}
                                    >
                                        <div className="card-body">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-blue-900">
                                                            {contact.name}
                                                        </h3>
                                                        {!contact.isRead && (
                                                            <div className="badge bg-blue-600 text-white border-blue-600">Unread</div>
                                                        )}
                                                        <div className="badge badge-outline border-blue-400 text-blue-700">
                                                            {contact.subject}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-blue-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-800">
                                                                {contact.email}
                                                            </a>
                                                        </div>
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="w-4 h-4" />
                                                                <a href={`tel:${contact.phone}`} className="hover:text-blue-800">
                                                                    {contact.phone}
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!contact.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(contact._id)}
                                                            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                                                            title="Mark as Read"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteContact(contact._id)}
                                                        className="btn btn-sm btn-error"
                                                        title="Delete Contact"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <h4 className="font-medium text-blue-900 mb-2">Message:</h4>
                                                <p className="text-blue-800 whitespace-pre-wrap">{contact.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Add Product Modal */}
                {showAddProductForm && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Add New Product</h3>
                                <button
                                    onClick={() => setShowAddProductForm(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>
                            <AddProductForm 
                                onSuccess={() => setShowAddProductForm(false)}
                                onCancel={() => setShowAddProductForm(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Edit Product Modal */}
                {editingProduct && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Edit Product</h3>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>
                            <AddProductForm 
                                product={editingProduct}
                                onSuccess={() => setEditingProduct(null)}
                                onCancel={() => setEditingProduct(null)}
                            />
                        </div>
                    </div>
                )}

                {/* Career Form Modal */}
                {showCareerForm && (
                    <CareerForm
                        career={editingCareer}
                        onClose={handleCareerFormClose}
                        onSuccess={handleCareerFormSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
