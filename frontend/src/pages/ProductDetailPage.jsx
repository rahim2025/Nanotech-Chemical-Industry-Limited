import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { 
    ArrowLeft, 
    Package, 
    User, 
    Calendar, 
    Star,
    MessageCircle,
    Share2,
    Edit,
    Trash2,
    CheckCircle,
    XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { getProductById, deleteProduct } = useProductStore();
    const { authUser } = useAuthStore();
    const { 
        comments, 
        isLoading: isLoadingComments, 
        pagination, 
        getProductComments, 
        clearComments 
    } = useCommentStore();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    // Load comments after product is loaded
                    getProductComments(productId);
                } else {
                    toast.error("Product not found");
                    navigate("/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
                navigate("/products");
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }

        // Cleanup function to clear comments when leaving the page
        return () => {
            clearComments();
        };
    }, [productId, getProductById, navigate, getProductComments, clearComments]);

    // Helper function to format pricing
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

    const handleDeleteProduct = async () => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            try {
                await deleteProduct(product._id);
                toast.success("Product deleted successfully");
                navigate("/products");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log("Share failed:", error);
            }
        } else {
            // Fallback - copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied to clipboard!");
            } catch (error) {
                toast.error("Failed to copy link");
            }
        }
    };

    const isAdmin = authUser?.role === "admin";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Loading skeleton */}
                        <div className="animate-pulse">
                            <div className="h-8 bg-base-300 rounded mb-8 w-32"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="h-96 bg-base-300 rounded-2xl"></div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-base-300 rounded"></div>
                                    <div className="h-6 bg-base-300 rounded w-3/4"></div>
                                    <div className="h-32 bg-base-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center py-16">
                        <Package size={64} className="mx-auto text-base-content/30 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                        <p className="text-base-content/70 mb-6">
                            The product you're looking for doesn't exist or has been removed.
                        </p>
                        <Link to="/products" className="btn btn-primary">
                            <ArrowLeft size={20} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="container mx-auto px-4 pb-8">
                <div className="max-w-6xl mx-auto">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate("/products")}
                            className="btn btn-ghost gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back to Products
                        </button>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={handleShare}
                                className="btn btn-outline btn-sm gap-2"
                            >
                                <Share2 size={16} />
                                Share
                            </button>
                            
                            {isAdmin && (
                                <>
                                    <Link
                                        to={`/products/${product._id}/edit`}
                                        className="btn btn-warning btn-sm gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDeleteProduct}
                                        className="btn btn-error btn-sm gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={product.photo || "/api/placeholder/600/600"}
                                    alt={product.name}
                                    className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
                                />
                                
                                {/* Stock Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className={`badge ${product.inStock ? 'badge-success' : 'badge-error'} gap-2 text-white`}>
                                        {product.inStock ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </div>
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="p-8 lg:p-12">
                                <div className="space-y-6">
                                    {/* Product Title */}
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
                                            {product.name}
                                        </h1>
                                        
                                        {/* Creator Info */}
                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <User size={16} />
                                            <span>Created by {product.createdBy?.fullName || 'Unknown'}</span>
                                            <span>•</span>
                                            <Calendar size={16} />
                                            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="bg-base-200 rounded-xl p-6 border border-base-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Package size={20} className="text-primary" />
                                            <h3 className="text-lg font-semibold">Pricing Information</h3>
                                        </div>
                                        <div className="text-2xl lg:text-3xl font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </div>
                                        {product.price?.unit && !product.price?.contactForPrice && (
                                            <div className="text-sm text-base-content/60 mt-1">
                                                Price per {product.price.unit}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                                        <div className="prose prose-sm max-w-none text-base-content/80">
                                            <p className="whitespace-pre-wrap leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-6 space-y-4">
                                        {product.price?.contactForPrice ? (
                                            <button className="btn btn-primary btn-lg w-full gap-2">
                                                <MessageCircle size={20} />
                                                Contact for Pricing
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary btn-lg w-full gap-2">
                                                <MessageCircle size={20} />
                                                Request Quote
                                            </button>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <button className="btn btn-outline gap-2">
                                                <Star size={18} />
                                                Add to Favorites
                                            </button>
                                            <button 
                                                onClick={handleShare}
                                                className="btn btn-outline gap-2"
                                            >
                                                <Share2 size={18} />
                                                Share Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    {/* Comments Section */}
                    <div className="mt-8">
                        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageCircle size={24} className="text-primary" />
                                <h2 className="text-2xl font-bold">Comments & Reviews</h2>
                                <div className="badge badge-primary badge-lg ml-auto">
                                    {pagination.totalComments} Comments
                                </div>
                            </div>
                            
                            {/* Comment Form */}
                            <CommentForm productId={productId} />
                            
                            {/* Comments List */}
                            <div className="space-y-6">
                                {isLoadingComments ? (
                                    <div className="flex justify-center py-8">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                ) : comments.length > 0 ? (
                                    <>
                                        {comments.map((comment) => (
                                            <CommentItem key={comment._id} comment={comment} />
                                        ))}
                                        
                                        {/* Load More Button */}
                                        {pagination.hasMore && (
                                            <div className="flex justify-center pt-6">
                                                <button
                                                    onClick={() => getProductComments(productId, pagination.currentPage + 1)}
                                                    className="btn btn-outline btn-primary"
                                                    disabled={isLoadingComments}
                                                >
                                                    {isLoadingComments ? (
                                                        <>
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        'Load More Comments'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <MessageCircle size={48} className="mx-auto text-base-content/30 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No Comments Yet</h3>
                                        <p className="text-base-content/70">
                                            Be the first to share your thoughts about this product!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
