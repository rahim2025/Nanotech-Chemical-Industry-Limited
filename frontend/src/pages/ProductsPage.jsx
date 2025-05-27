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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="card bg-base-100 shadow-sm animate-pulse rounded-xl overflow-hidden">
                                <div className="h-28 bg-base-300"></div>
                                <div className="card-body p-2.5">
                                    <div className="h-3 bg-base-300 rounded mb-1"></div>
                                    <div className="h-2 bg-base-300 rounded mb-2"></div>
                                    <div className="h-2 bg-base-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-base-300 rounded mb-1"></div>
                                    <div className="h-4 bg-base-300 rounded w-1/2"></div>
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
                        )}                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">                        {products.map((product) => (
                            <div key={product._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 group border border-base-200 rounded-xl overflow-hidden">
                                {/* Product Image */}
                                <figure className="relative h-28 overflow-hidden">
                                    <Link to={`/products/${product._id}`}>
                                        <img
                                            src={product.photo || "/api/placeholder/400/300"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                        />
                                    </Link>
                                      {/* Stock Status Badge */}
                                    <div className="absolute top-1.5 right-1.5">
                                        <div className={`badge badge-xs ${product.inStock ? 'badge-success' : 'badge-error'} text-white text-[10px] px-1`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    {isAdmin && (
                                        <div className="absolute top-1.5 left-1.5 flex gap-1">
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="btn btn-xs btn-circle btn-warning h-5 w-5 min-h-5"
                                                title="Edit Product"
                                            >
                                                <Edit size={8} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="btn btn-xs btn-circle btn-error h-5 w-5 min-h-5"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={8} />
                                            </button>
                                        </div>
                                    )}
                                </figure>
                                    {/* Product Info */}
                                <div className="card-body p-2.5">
                                    <Link to={`/products/${product._id}`}>
                                        <h2 className="card-title text-xs font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-tight mb-1">
                                            {product.name}
                                        </h2>
                                    </Link>
                                    <p className="text-base-content/70 text-[10px] line-clamp-2 mb-2 leading-tight">
                                        {product.description}
                                    </p>
                                        {/* Pricing Information */}
                                    <div className="mt-1 p-1.5 bg-base-200/50 rounded-lg border border-base-300/50">
                                        <div className="text-[9px] text-base-content/60 uppercase tracking-wide mb-0.5 font-medium">Price</div>
                                        <div className="text-xs font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </div>
                                    </div>
                                        <div className="card-actions justify-end mt-1.5">
                                        <Link 
                                            to={`/products/${product._id}`}
                                            className="btn btn-primary btn-xs text-[10px] h-6 px-2 rounded-md"
                                        >
                                            View
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
