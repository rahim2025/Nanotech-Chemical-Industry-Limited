import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import AddProductForm from "../components/AddProductForm";
import toast from "react-hot-toast";

const ProductsPage = () => {
    const { products, isLoading, getAllProducts, deleteProduct } = useProductStore();
    const { authUser } = useAuthStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);    // Helper function to format pricing
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

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const isAdmin = authUser?.role === "admin";
    const isLoggedIn = !!authUser;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card bg-base-100 shadow-xl animate-pulse">
                                <div className="h-48 bg-base-300 rounded-t-2xl"></div>
                                <div className="card-body">
                                    <div className="h-6 bg-base-300 rounded mb-2"></div>
                                    <div className="h-4 bg-base-300 rounded mb-2"></div>
                                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="container mx-auto px-4">
                {/* Welcome Banner for non-logged-in users */}
                {!isLoggedIn && (
                    <div className="alert alert-info mb-8">
                        <div className="flex items-center gap-2">
                            <Package className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold">Welcome to our Chemical Products Catalog!</h3>
                                <div className="text-sm">
                                    Browse our products freely. 
                                    <Link to="/signup" className="link link-primary ml-1">Create an account</Link> 
                                    or 
                                    <Link to="/login" className="link link-primary ml-1">sign in</Link> 
                                    to access more features.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">Our Products</h1>
                        <p className="text-base-content/70 mt-2">
                            Discover our range of chemical products and solutions
                        </p>
                    </div>
                    
                    {isAdmin && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="btn btn-primary gap-2"
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={64} className="mx-auto text-base-content/30 mb-4" />
                        <h3 className="text-xl font-semibold text-base-content mb-2">
                            No products available
                        </h3>
                        <p className="text-base-content/70 mb-6">
                            {isAdmin 
                                ? "Add your first product to get started!" 
                                : isLoggedIn 
                                    ? "Check back later for new products."
                                    : "Check back later for new products or sign in to manage products."}
                        </p>
                        
                        {!isLoggedIn && (
                            <div className="flex gap-4 justify-center">
                                <Link to="/login" className="btn btn-primary">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="btn btn-outline">
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">                        {products.map((product) => (
                            <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                {/* Product Image */}
                                <figure className="relative h-48 overflow-hidden">
                                    <Link to={`/products/${product._id}`}>
                                        <img
                                            src={product.photo || "/api/placeholder/400/300"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                        />
                                    </Link>
                                    
                                    {/* Stock Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <div className={`badge ${product.inStock ? 'badge-success' : 'badge-error'} text-white`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    {isAdmin && (
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="btn btn-sm btn-circle btn-warning"
                                                title="Edit Product"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="btn btn-sm btn-circle btn-error"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </figure>
                                  {/* Product Info */}
                                <div className="card-body">
                                    <Link to={`/products/${product._id}`}>
                                        <h2 className="card-title text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                                            {product.name}
                                        </h2>
                                    </Link>
                                    <p className="text-base-content/70 text-sm line-clamp-3">
                                        {product.description}
                                    </p>
                                      {/* Pricing Information */}
                                    <div className="mt-3 p-3 bg-base-200 rounded-lg border border-base-300">
                                        <div className="text-sm text-base-content/60 uppercase tracking-wide mb-1">Price</div>
                                        <div className="text-lg font-bold" style={{ 
                                            color: '#0d47a1', 
                                            textShadow: '0px 0px 1px rgba(0,0,0,0.1)',
                                            backgroundColor: 'rgba(255,255,255,0.7)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            display: 'inline-block'
                                        }}>
                                            {formatPrice(product.price)}
                                        </div>
                                    </div>
                                      <div className="card-actions justify-end mt-4">
                                        <Link 
                                            to={`/products/${product._id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Product Modal */}
                {showAddForm && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Add New Product</h3>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>
                            <AddProductForm 
                                onSuccess={() => setShowAddForm(false)}
                                onCancel={() => setShowAddForm(false)}
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

export default ProductsPage;
