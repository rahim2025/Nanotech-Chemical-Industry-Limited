import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCommentStore } from "../store/useCommentStore";
import { axiosInstance } from "../lib/axios";
import "../styles/ProductDetailPage.css";
import { 
    ArrowLeft, 
    Package, 
    User, 
    Calendar, 
    Star,
    StarHalf,
    MessageCircle,
    Share2,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Mail,
    Info,
    FileText,
    Grid3X3,
    Heart,
    ChevronRight,
    ChevronLeft,
    Clock,
    Filter,
    SortDesc,
    ChevronDown,
    Camera,
    Bookmark,
    Box,
    Award,
    ShieldCheck,
    Zap,
    AlertCircle,
    Download
} from "lucide-react";
import toast from "react-hot-toast";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import ProductInquiryForm from "../components/ProductInquiryForm";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { getProductById, deleteProduct, getAllProducts } = useProductStore();
    const { authUser } = useAuthStore();
    const { 
        comments, 
        isLoading: isLoadingComments, 
        pagination, 
        getProductComments, 
        clearComments 
    } = useCommentStore();
    
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [commentSort, setCommentSort] = useState("newest");
    const [isNavSticky, setIsNavSticky] = useState(false);    // New state variables for enhanced features
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [productImages, setProductImages] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showFullSpecifications, setShowFullSpecifications] = useState(false);
    const [downloadableResources, setDownloadableResources] = useState([]);
      // Enhanced UI state variables
    const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);
    const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showFab, setShowFab] = useState(false);    const [showSortDropdown, setShowSortDropdown] = useState(false);
      const productNavRef = useRef(null);
    const contentRef = useRef(null);
    const dropdownRef = useRef(null);
    
    // Handle sticky navigation
    useEffect(() => {
        const handleScroll = () => {
            if (productNavRef.current && contentRef.current) {
                const navPosition = productNavRef.current.getBoundingClientRect().top;
                setIsNavSticky(navPosition <= 0);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
      // Handle scroll progress and FAB visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            
            setScrollProgress(scrollPercent * 100);
            setShowFab(scrollTop > 300); // Show FAB after scrolling 300px
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };

        if (showSortDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSortDropdown]);
      // Keyboard navigation for fullscreen gallery
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (showFullscreenGallery) {
                switch (e.key) {
                    case 'ArrowLeft':
                        prevImage();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                    case 'Escape':
                        setShowFullscreenGallery(false);
                        break;
                    default:
                        break;
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showFullscreenGallery, productImages.length]);
    
    // Click outside to close sort dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSortDropdown && !event.target.closest('.sort-container')) {
                setShowSortDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSortDropdown]);
    
    // Fetch product and comments
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(productId);
                if (productData) {
                    setProduct(productData);
                    // Load comments after product is loaded
                    getProductComments(productId);
                    
                    // Track recently viewed products in localStorage
                    const recentlyViewedProducts = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                    
                    // Add this product to recently viewed if not already there
                    if (!recentlyViewedProducts.some(p => p._id === productData._id)) {
                        const updatedRecentlyViewed = [
                            {
                                _id: productData._id,
                                name: productData.name,
                                photo: productData.photo,
                                price: productData.price,
                                viewedAt: new Date().toISOString()
                            },
                            ...recentlyViewedProducts.slice(0, 3)
                        ];
                        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
                        setRecentlyViewed(updatedRecentlyViewed);
                    } else {
                        // Update the viewedAt timestamp for the current product
                        const updatedRecentlyViewed = recentlyViewedProducts.map(p => 
                            p._id === productData._id ? { ...p, viewedAt: new Date().toISOString() } : p
                        );
                        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
                        setRecentlyViewed(updatedRecentlyViewed);
                    }
                    
                    // Fetch related products
                    fetchRelatedProducts(productData);
                    
                    // Handle product images (main photo + additional photos if available)
                    const images = [];
                    if (productData.photo) {
                        images.push(productData.photo);
                    }
                    
                    // If product has additionalPhotos array, add them
                    if (productData.additionalPhotos && Array.isArray(productData.additionalPhotos)) {
                        images.push(...productData.additionalPhotos);
                    }
                    
                    // If we still have no images, add a placeholder
                    if (images.length === 0) {
                        images.push("/api/placeholder/600/600");
                    }
                    
                    setProductImages(images);
                    
                    // Setup dummy downloadable resources for demo
                    if (productData.category && productData.category.toLowerCase().includes('chemical')) {
                        setDownloadableResources([
                            {
                                id: 'sds-1',
                                name: 'Safety Data Sheet (SDS)',
                                type: 'pdf',
                                url: '#'
                            },
                            {
                                id: 'tech-1',
                                name: 'Technical Specifications',
                                type: 'pdf',
                                url: '#'
                            }
                        ]);
                    }
                    
                    // Check if product is in favorites
                    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                    setIsFavorited(favorites.includes(productData._id));
                    
                } else {
                    toast.error("Product not found");
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        };
        
        const fetchRelatedProducts = async (currentProduct) => {
            setIsLoadingRelated(true);
            try {
                // Get products from the store state first, if not available fetch them
                const { products } = useProductStore.getState();
                let allProducts = products;
                
                // If no products in store, fetch them directly from API
                if (!allProducts || allProducts.length === 0) {
                    const res = await axiosInstance.get("/products");
                    allProducts = res.data;
                }
                
                if (allProducts) {
                    // Filter to get related products (same category or similar names)
                    const related = allProducts.filter(p => 
                        p._id !== currentProduct._id && 
                        (p.category === currentProduct.category || 
                         p.name.toLowerCase().includes(currentProduct.name.toLowerCase().split(' ')[0]))
                    ).slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Error fetching related products:", error);
            } finally {
                setIsLoadingRelated(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
        
        // Load recently viewed from localStorage
        const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(storedRecentlyViewed.filter(p => p._id !== productId).slice(0, 4));

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
            try {                await deleteProduct(product._id);
                toast.success("Product deleted successfully");
                navigate("/");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
                toast.success('Shared successfully!', {
                    icon: '📤',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log("Share failed:", error);
                    toast.error('Share failed', {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }
            }
        } else {
            // Fallback - copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Product link copied to clipboard!', {
                    icon: '📋',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            } catch (error) {
                toast.error('Failed to copy link', {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        }
    };
    
    // Toggle favorite status
    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (isFavorited) {
            // Remove from favorites
            const updatedFavorites = favorites.filter(id => id !== product._id);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorited(false);
            toast.success('Removed from favorites', {
                icon: '💔',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } else {
            // Add to favorites
            const updatedFavorites = [...favorites, product._id];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setIsFavorited(true);
            toast.success('Added to favorites', {
                icon: '❤️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };
    
    // Gallery navigation
    const nextImage = () => {
        setCurrentImageIndex(prev => 
            prev === productImages.length - 1 ? 0 : prev + 1
        );
    };
    
    const prevImage = () => {
        setCurrentImageIndex(prev => 
            prev === 0 ? productImages.length - 1 : prev - 1
        );
    };
      const setImage = (index) => {
        setCurrentImageIndex(index);
    };
      // Enhanced gallery functions
    const handleImageError = (index) => {
        setImageLoadErrors(prev => new Set([...prev, index]));
        toast.error(`Failed to load image ${index + 1}`, {
            icon: '🖼️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };
    
    const handleImageZoom = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
        setIsZoomed(true);
    };
    
    const handleImageZoomOut = () => {
        setIsZoomed(false);
    };
    
    const toggleFullscreenGallery = () => {
        setShowFullscreenGallery(!showFullscreenGallery);
        if (!showFullscreenGallery) {
            toast.success('Press ESC to exit fullscreen', {
                icon: '🔍',
                duration: 2000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };
    
    // Download resource function
    const handleDownloadResource = (resource) => {
        // In a real app, this would download the actual file
        toast.success(`Downloading ${resource.name}...`, {
            icon: '📄',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        // For demo purposes, we'll just show a success message
    };
    
    // Sort comments function
    const getSortedComments = () => {
        if (!comments) return [];
        
        switch (commentSort) {
            case 'newest':
                return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'admin-replied':
                return [...comments].sort((a, b) => (b.adminReply?.text ? 1 : 0) - (a.adminReply?.text ? 1 : 0));
            case 'highest-rating':
                return [...comments].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return comments;
        }
    };
    
    // Calculate average rating
    useEffect(() => {
        if (comments && comments.length > 0) {
            // For demo purposes, generate random ratings for comments that don't have one
            const ratingsSum = comments.reduce((sum, comment) => {
                // If comment has a rating, use it; otherwise generate a random rating between 3-5
                const rating = comment.rating || Math.floor(Math.random() * 3) + 3;
                return sum + rating;
            }, 0);
            
            setAverageRating((ratingsSum / comments.length).toFixed(1));
        }
    }, [comments]);
    
    // Render star rating component
    const renderStarRating = (rating, size = 16) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} size={size} className="star filled" />;
                    } else if (i === fullStars && hasHalfStar) {
                        return <StarHalf key={i} size={size} className="star half-filled" />;
                    } else {
                        return <Star key={i} size={size} className="star" />;
                    }
                })}
            </div>
        );
    };
    
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setActiveTab(sectionId);
    };
    
    const isAdmin = authUser?.role === "admin";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">                        {/* Loading skeleton */}
                        <div className="animate-pulse">
                            <div className="h-6 bg-base-300 rounded mb-6 w-32"></div>
                            <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                                    <div className="h-80 bg-base-300"></div>
                                    <div className="lg:col-span-2 p-6 space-y-4">
                                        <div className="h-6 bg-base-300 rounded"></div>
                                        <div className="h-4 bg-base-300 rounded w-3/4"></div>
                                        <div className="h-20 bg-base-300 rounded"></div>
                                        <div className="h-16 bg-base-300 rounded"></div>
                                    </div>
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
                        </p>                        <Link to="/" className="btn btn-primary">
                            <ArrowLeft size={20} />
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto" ref={contentRef}>
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate("/")}
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
                    <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">                            {/* Enhanced Product Image Gallery */}
                            <div className="relative">
                                <div className="overflow-hidden h-full product-image-container group">
                                    <div 
                                        className={`relative cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
                                        onMouseMove={handleImageZoom}
                                        onMouseLeave={handleImageZoomOut}
                                        onClick={toggleFullscreenGallery}
                                    >
                                        <img
                                            src={productImages[currentImageIndex] || "/api/placeholder/600/600"}
                                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                            className={`product-image w-full h-full object-cover min-h-[350px] lg:min-h-[400px] max-h-[500px] transition-all duration-500 ${
                                                isZoomed 
                                                    ? 'scale-150' 
                                                    : 'group-hover:scale-105'
                                            }`}
                                            style={
                                                isZoomed 
                                                    ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                                                    : {}
                                            }
                                            onError={() => handleImageError(currentImageIndex)}
                                        />
                                        
                                        {/* Fullscreen Gallery Button */}
                                        <button 
                                            className="absolute top-4 right-16 btn btn-circle btn-sm bg-black/50 text-white border-none hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFullscreenGallery();
                                            }}
                                        >
                                            <Grid3X3 size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* Gallery Navigation Arrows */}
                                    {productImages.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImage}
                                                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button 
                                                onClick={nextImage}
                                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            
                                            {/* Image Counter */}
                                            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
                                                {currentImageIndex + 1} / {productImages.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {/* Stock Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <div className={`badge ${product.inStock ? 'badge-success' : 'badge-error'} gap-1 text-white shadow-md shine-effect`}>
                                        {product.inStock ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </div>
                                </div>
                                
                                {/* Favorite Button */}
                                <button 
                                    onClick={toggleFavorite}
                                    className={`absolute top-4 left-4 btn btn-circle btn-sm ${isFavorited ? 'bg-primary text-primary-content btn-bounce' : 'bg-white/90 backdrop-blur-sm'} hover:bg-primary hover:text-primary-content border-none shadow-md transition-all btn-ripple`}
                                >
                                    <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                                </button>
                                
                                {/* Enhanced Thumbnails */}
                                {productImages.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                                        <div className="flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg max-w-fit">
                                            {productImages.slice(0, 5).map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setImage(idx)}
                                                    className={`relative w-12 h-12 rounded-md overflow-hidden transition-all hover:scale-110 ${
                                                        idx === currentImageIndex 
                                                            ? 'ring-2 ring-primary scale-110' 
                                                            : 'opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImageError(idx)}
                                                    />
                                                    {idx === currentImageIndex && (
                                                        <div className="absolute inset-0 bg-primary/20"></div>
                                                    )}
                                                </button>
                                            ))}
                                            {productImages.length > 5 && (
                                                <div className="flex items-center justify-center w-12 h-12 bg-black/30 rounded-md text-white text-xs">
                                                    +{productImages.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </div>                                )}
                            </div>

                            {/* Product Information */}
                            <div className="p-6 lg:p-8">
                                <div className="space-y-6">
                                    {/* Product Title */}
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-base-content mb-3">
                                            {product.name}
                                        </h1>
                                        
                                        {/* Category Tag */}
                                        {product.category && (
                                            <div className="badge badge-primary badge-outline mb-3">
                                                {product.category}
                                            </div>
                                        )}
                                        
                                        {/* Creator Info */}
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} className="text-primary"/>
                                                <span>{product.createdBy?.fullName || 'Unknown'}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-primary"/>
                                                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="bg-base-200/50 rounded-lg p-5 border border-base-300/50 animate-fadeIn">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package size={18} className="text-primary" />
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

                                    {/* Quick Description */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Product Overview</h3>
                                        <div className="prose prose-sm max-w-none text-base-content/80">
                                            <p className="whitespace-pre-wrap leading-relaxed">
                                                {product.description?.substring(0, 200)}
                                                {product.description?.length > 200 ? '...' : ''}
                                            </p>
                                        </div>
                                    </div>                                    
                                    {/* Action Buttons */}
                                    <div className="pt-4 space-y-4">
                                        {product.price?.contactForPrice ? (
                                            <button 
                                                onClick={() => setShowInquiryForm(true)} 
                                                className="btn btn-primary w-full gap-2 hover:shadow-lg transition-shadow"
                                            >
                                                <Mail size={18} />
                                                Contact for Pricing
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setShowInquiryForm(true)}
                                                className="btn btn-primary w-full gap-2 hover:shadow-lg transition-shadow"
                                            >
                                                <MessageCircle size={18} />
                                                Request Quote
                                            </button>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="btn btn-outline gap-2 hover:shadow-md transition-shadow">
                                                <Star size={16} />
                                                Add to Favorites
                                            </button>
                                            <button 
                                                onClick={handleShare}
                                                className="btn btn-outline gap-2 hover:shadow-md transition-shadow"
                                            >
                                                <Share2 size={16} />
                                                Share Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Navigation Tabs */}
                    <div 
                        ref={productNavRef}
                        className={`flex mb-6 overflow-x-auto scrollbar-hide bg-base-100 rounded-lg ${
                            isNavSticky ? 'sticky top-0 z-10 shadow-lg animate-slideDown' : ''
                        }`}
                    >
                        <button 
                            onClick={() => scrollToSection("description")} 
                            className={`p-4 flex-1 flex items-center justify-center gap-2 font-medium border-b-2 transition-colors ${
                                activeTab === "description" ? "border-primary text-primary" : "border-transparent text-base-content/70 hover:text-primary hover:border-primary/30"
                            }`}
                        >
                            <FileText size={16} />
                            Description
                        </button>
                        <button 
                            onClick={() => scrollToSection("specifications")} 
                            className={`p-4 flex-1 flex items-center justify-center gap-2 font-medium border-b-2 transition-colors ${
                                activeTab === "specifications" ? "border-primary text-primary" : "border-transparent text-base-content/70 hover:text-primary hover:border-primary/30"
                            }`}
                        >
                            <Info size={16} />
                            Specifications
                        </button>
                        <button 
                            onClick={() => scrollToSection("comments")} 
                            className={`p-4 flex-1 flex items-center justify-center gap-2 font-medium border-b-2 transition-colors ${
                                activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-base-content/70 hover:text-primary hover:border-primary/30"
                            }`}
                        >
                            <MessageCircle size={16} />
                            Reviews ({pagination.totalComments})
                        </button>
                        <button 
                            onClick={() => scrollToSection("related")} 
                            className={`p-4 flex-1 flex items-center justify-center gap-2 font-medium border-b-2 transition-colors ${
                                activeTab === "related" ? "border-primary text-primary" : "border-transparent text-base-content/70 hover:text-primary hover:border-primary/30"
                            }`}
                        >
                            <Grid3X3 size={16} />
                            Related
                        </button>
                    </div>
                    
                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Full Description Section */}
                        <div id="description" className="bg-base-100 rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-5 border-b border-base-200 pb-4">
                                <FileText size={22} className="text-primary" />
                                <h2 className="text-xl font-bold">Product Description</h2>
                            </div>
                            
                            <div className="prose prose-lg max-w-none text-base-content/80">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                        
                        {/* Specifications Section */}
                        <div id="specifications" className="bg-base-100 rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-5 border-b border-base-200 pb-4">
                                <Info size={22} className="text-primary" />
                                <h2 className="text-xl font-bold">Specifications</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">

                                    <div className="grid grid-cols-2 border-b border-base-200 pb-2">
                                        <span className="text-base-content/70 font-medium">Availability</span>
                                        <span className={product.inStock ? 'text-success' : 'text-error'}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-base-200 pb-2">
                                        <span className="text-base-content/70 font-medium">Created On</span>
                                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 border-b border-base-200 pb-2">
                                        <span className="text-base-content/70 font-medium">Pricing</span>
                                        <span className="font-semibold text-primary">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-base-200 pb-2">
                                        <span className="text-base-content/70 font-medium">Unit</span>
                                        <span>{product.price?.unit || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-base-200 pb-2">
   
                                    </div>
                                </div>
                            </div>
                        </div>
                          {/* Enhanced Comments Section */}
                        <div id="comments" className="bg-base-100 rounded-xl shadow-lg p-6 modern-comment-section">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-base-200 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MessageCircle size={22} className="text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">Reviews & Comments</h2>
                                    <div className="badge badge-primary shine-effect">
                                        {pagination.totalComments}
                                    </div>
                                </div>                                {/* Enhanced comment sorting options with custom dropdown */}                                {comments.length > 1 && (
                                    <div className={`sort-container flex items-center gap-3 p-3 rounded-lg shadow-sm border border-base-300 transition-all ${showSortDropdown ? 'ring-2 ring-blue-200' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <Filter size={16} className="text-primary" />
                                            <span className="text-sm font-medium text-base-content whitespace-nowrap">Sort by:</span>
                                        </div>                                        <div className="relative z-50" ref={dropdownRef}>                                            {/* Custom Dropdown */}
                                            <button
                                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setShowSortDropdown(!showSortDropdown);
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setShowSortDropdown(false);
                                                    }
                                                }}
                                                className="sort-dropdown-button flex items-center justify-between min-w-[140px] px-3 py-2 text-sm font-medium rounded-md focus:outline-none transition-all"
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    color: '#1f2937',
                                                    border: '1px solid #d1d5db'
                                                }}
                                                aria-expanded={showSortDropdown}
                                                aria-haspopup="listbox"
                                                aria-label="Sort comments"
                                            >
                                                <span>
                                                    {commentSort === 'newest' && 'Newest First'}
                                                    {commentSort === 'oldest' && 'Oldest First'}
                                                    {commentSort === 'admin-replied' && 'Admin Replied'}
                                                    {commentSort === 'highest-rating' && 'Highest Rating'}
                                                </span>
                                                <ChevronDown 
                                                    size={14} 
                                                    className={`ml-2 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                                                    style={{ color: '#6b7280' }}
                                                />
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            {showSortDropdown && (
                                                <div 
                                                    className="custom-sort-dropdown absolute top-full left-0 right-0 mt-1 rounded-md z-50"
                                                    style={{
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #d1d5db',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                    }}
                                                >
                                                    <div className="py-1">
                                                        {[
                                                            { value: 'newest', label: 'Newest First' },
                                                            { value: 'oldest', label: 'Oldest First' },
                                                            { value: 'admin-replied', label: 'Admin Replied' },
                                                            { value: 'highest-rating', label: 'Highest Rating' }
                                                        ].map((option) => (
                                                            <button
                                                                key={option.value}
                                                                onClick={() => {
                                                                    setCommentSort(option.value);
                                                                    setShowSortDropdown(false);
                                                                    toast.success(`Sorted by ${option.label}`, {
                                                                        icon: '🔄',
                                                                        duration: 1500,
                                                                        style: {
                                                                            borderRadius: '10px',
                                                                            background: '#333',
                                                                            color: '#fff',
                                                                        },
                                                                    });
                                                                }}
                                                                className={`block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                                                                    commentSort === option.value ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-700'
                                                                }`}
                                                                style={{
                                                                    backgroundColor: commentSort === option.value ? '#eff6ff' : 'transparent',
                                                                    color: commentSort === option.value ? '#2563eb' : '#374151'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (commentSort !== option.value) {
                                                                        e.target.style.backgroundColor = '#f9fafb';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (commentSort !== option.value) {
                                                                        e.target.style.backgroundColor = 'transparent';
                                                                    }
                                                                }}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Enhanced Comment Form */}
                            <div className="comment-form-container">
                                <CommentForm productId={productId} />
                            </div>
                            
                            {/* Enhanced Comments List */}
                            <div className="space-y-6 mt-6">
                                {isLoadingComments ? (
                                    <div className="flex justify-center py-8">
                                        <div className="loading-container">
                                            <span className="loading loading-spinner loading-lg text-primary"></span>
                                            <p className="text-sm text-base-content/70 mt-2">Loading comments...</p>
                                        </div>
                                    </div>
                                ) : comments.length > 0 ? (
                                    <>
                                        <div className="animate-fadeIn space-y-4">
                                            {getSortedComments().map((comment, index) => (
                                                <div 
                                                    key={comment._id} 
                                                    className={`comment-item-wrapper transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md rounded-lg ${
                                                        index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
                                                    }`}
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <CommentItem comment={comment} />
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Enhanced Load More Button */}
                                        {pagination.hasMore && (
                                            <div className="flex justify-center pt-6">
                                                <button
                                                    onClick={() => getProductComments(productId, pagination.currentPage + 1)}
                                                    className="btn btn-outline btn-primary gap-2 btn-ripple hover:shadow-lg transition-all duration-300"
                                                    disabled={isLoadingComments}
                                                >
                                                    {isLoadingComments ? (
                                                        <>
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Load More Comments
                                                            <ChevronDown size={16} className="transition-transform group-hover:translate-y-1" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12 bg-gradient-to-br from-base-200/30 to-base-300/20 rounded-xl border border-base-300/30 backdrop-blur-sm">
                                        <div className="floating-animation">
                                            <MessageCircle size={48} className="mx-auto text-primary/60 mb-4" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                                        <p className="text-base-content/70 mb-4">
                                            Be the first to share your thoughts about this product!
                                        </p>
                                        <button 
                                            onClick={() => document.getElementById('comment-form-input')?.focus()}
                                            className="btn btn-primary btn-sm btn-ripple shine-effect hover:scale-105 transition-all duration-300"
                                        >
                                            <Edit size={16} />
                                            Write a Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Related Products Section */}
                        <div id="related" className="bg-base-100 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between gap-3 mb-5 border-b border-base-200 pb-4">
                                <div className="flex items-center gap-3">
                                    <Grid3X3 size={22} className="text-primary" />
                                    <h2 className="text-xl font-bold">Related Products</h2>
                                </div>
                                
                                <Link to="/" className="text-primary text-sm flex items-center gap-1 hover:underline">
                                    View All Products
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                            
                            {isLoadingRelated ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="card bg-base-200 animate-pulse h-48">
                                            <div className="h-24 bg-base-300"></div>
                                            <div className="card-body p-3">
                                                <div className="h-3 bg-base-300 rounded mb-2"></div>
                                                <div className="h-2 bg-base-300 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : relatedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {relatedProducts.map((relatedProduct) => (
                                        <Link 
                                            key={relatedProduct._id}
                                            to={`/products/${relatedProduct._id}`}
                                            className="card bg-base-200/50 overflow-hidden hover:shadow-md transition-all duration-300 border border-base-300/50"
                                        >
                                            <figure className="h-28 overflow-hidden">
                                                <img 
                                                    src={relatedProduct.photo || "/api/placeholder/300/200"} 
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                />
                                            </figure>
                                            <div className="card-body p-3">
                                                <h3 className="card-title text-xs line-clamp-2">{relatedProduct.name}</h3>
                                                <p className="text-primary text-xs font-semibold mt-1">
                                                    {formatPrice(relatedProduct.price) || "Contact for pricing"}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-base-200/30 rounded-lg">
                                    <p className="text-base-content/70">No related products found</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Recently Viewed Products */}
                        {recentlyViewed.length > 0 && (
                            <div className="bg-base-100 rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between gap-3 mb-5 border-b border-base-200 pb-4">
                                    <div className="flex items-center gap-3">
                                        <Clock size={22} className="text-primary" />
                                        <h2 className="text-xl font-bold">Recently Viewed</h2>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {recentlyViewed.map((viewedProduct) => (
                                        <Link 
                                            key={viewedProduct._id}
                                            to={`/products/${viewedProduct._id}`}
                                            className="card bg-base-200/50 overflow-hidden hover:shadow-md transition-all duration-300 border border-base-300/50"
                                        >
                                            <figure className="h-24 overflow-hidden">
                                                <img 
                                                    src={viewedProduct.photo || "/api/placeholder/300/200"} 
                                                    alt={viewedProduct.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                />
                                            </figure>
                                            <div className="card-body p-3">
                                                <h3 className="text-xs font-medium line-clamp-2">{viewedProduct.name}</h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={10} className="text-base-content/50" />
                                                    <p className="text-[10px] text-base-content/50">
                                                        Viewed {new Date(viewedProduct.viewedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>                    {/* Inquiry Form Modal */}
                    {showInquiryForm && (
                        <div className="modal modal-open">
                            <div className="modal-box max-w-2xl">
                                <ProductInquiryForm 
                                    product={product} 
                                    onClose={() => setShowInquiryForm(false)} 
                                />
                            </div>
                            <div className="modal-backdrop" onClick={() => setShowInquiryForm(false)}></div>
                        </div>
                    )}
                </div>
                
                {/* Scroll Progress Bar */}
                <div className="scroll-progress">
                    <div 
                        className="scroll-progress-bar"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
                
                {/* Floating Action Button */}
                {showFab && (
                    <div className="fab">
                        <button 
                            onClick={toggleFavorite}
                            className={`fab-button ${isFavorited ? 'fab-active' : ''}`}
                            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
                        </button>
                        <button 
                            onClick={handleShare}
                            className="fab-button"
                            title="Share product"
                        >
                            <Share2 size={20} />
                        </button>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="fab-button"
                            title="Scroll to top"
                        >
                            <ChevronRight size={20} className="transform -rotate-90" />
                        </button>
                    </div>
                )}
                
                {/* Fullscreen Gallery Modal */}
                {showFullscreenGallery && (
                    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            {/* Close Button */}
                            <button 
                                onClick={() => setShowFullscreenGallery(false)}
                                className="absolute top-4 right-4 z-10 btn btn-circle btn-lg bg-black/50 text-white border-none hover:bg-black/70"
                            >
                                <XCircle size={24} />
                            </button>
                            
                            {/* Main Image */}
                            <div className="relative max-w-4xl max-h-full">
                                <img
                                    src={productImages[currentImageIndex] || "/api/placeholder/800/800"}
                                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                                
                                {/* Navigation Arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevImage}
                                            className="absolute top-1/2 left-4 transform -translate-y-1/2 btn btn-circle btn-lg bg-black/50 text-white border-none hover:bg-black/70"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="absolute top-1/2 right-4 transform -translate-y-1/2 btn btn-circle btn-lg bg-black/50 text-white border-none hover:bg-black/70"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                                {currentImageIndex + 1} of {productImages.length}
                            </div>
                            
                            {/* Thumbnail Strip */}
                            {productImages.length > 1 && (
                                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-lg backdrop-blur-sm max-w-full overflow-x-auto">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setImage(idx)}
                                            className={`w-16 h-16 rounded-md overflow-hidden transition-all hover:scale-110 ${
                                                idx === currentImageIndex 
                                                    ? 'ring-2 ring-white scale-110' 
                                                    : 'opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;