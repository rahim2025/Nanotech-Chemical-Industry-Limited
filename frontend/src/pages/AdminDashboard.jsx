import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Shield, ShieldOff, Trash2, User, Crown, Package, Plus, Edit, BarChart3, Eye } from "lucide-react";
import AddProductForm from "../components/AddProductForm";

const AdminDashboard = () => {
    const { users, isLoading, getAllUsers, promoteToAdmin, demoteToUser, deleteUser } = useAdminStore();
    const { products, getAllProducts, deleteProduct } = useProductStore();
    const { authUser } = useAuthStore();
    const [filter, setFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("users");
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        getAllUsers();
        getAllProducts();
    }, [getAllUsers, getAllProducts]);    // Helper function to format pricing
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
            <div className="bg-base-100 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-accent-content/80">Stock Status</div>
                        <div className="stat-value">
                            {products.length > 0 ? Math.round((products.filter(p => p.inStock).length / products.length) * 100) : 0}%
                        </div>
                        <div className="stat-desc text-accent-content/60">Products in stock</div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tabs tabs-boxed mb-6">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`tab gap-2 ${activeTab === "users" ? "tab-active" : ""}`}
                    >
                        <Users className="w-4 h-4" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`tab gap-2 ${activeTab === "products" ? "tab-active" : ""}`}
                    >
                        <Package className="w-4 h-4" />
                        Product Management
                    </button>
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
            </div>
        </div>
    );
};

export default AdminDashboard;
