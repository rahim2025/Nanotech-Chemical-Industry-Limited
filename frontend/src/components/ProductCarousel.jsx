import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';

const ProductCarousel = () => {
    const { products, getAllProducts, isLoading } = useProductStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [productsPerView, setProductsPerView] = useState(5);

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);    // Handle responsive products per view
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setProductsPerView(2); // Mobile: 2 products
            } else if (width < 1024) {
                setProductsPerView(3); // Tablet: 3 products
            } else if (width < 1280) {
                setProductsPerView(4); // Large tablet/small desktop: 4 products
            } else if (width < 1536) {
                setProductsPerView(5); // Large desktop: 5 products
            } else {
                setProductsPerView(6); // Extra large desktop: 6 products
            }
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (products.length <= productsPerView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                return nextIndex >= products.length ? 0 : nextIndex;
            });
        }, 3000); // Auto-scroll every 3 seconds

        return () => clearInterval(interval);
    }, [products.length, productsPerView]);

    // Update visible products based on current index
    useEffect(() => {
        if (products.length === 0) return;

        const visible = [];
        for (let i = 0; i < productsPerView; i++) {
            const productIndex = (currentIndex + i) % products.length;
            visible.push(products[productIndex]);
        }
        setVisibleProducts(visible);
    }, [currentIndex, products, productsPerView]);    if (isLoading) {
        return (
            <div className="w-full mb-2">
                <div className="flex justify-center items-center h-20">
                    <div className="loading loading-spinner loading-md"></div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="w-full mb-2">
                <div className="text-center py-4">
                    <p className="text-base-content/60 text-xs">No products available</p>
                </div>
            </div>
        );
    }    return (
        <div className="w-full mb-2">
              {/* Carousel Container */}
            <div className="relative overflow-hidden">                {/* Container for products - responsive grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                    {visibleProducts.map((product, index) => (
                        <div key={`${product._id}-${currentIndex}-${index}`} className="w-full">                            <Link 
                                to={`/products/${product._id}`}
                                className="block group"
                            >{/* Product Card - Compact Smart Shape */}                                <div className="bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group-hover:scale-[1.02] h-24 flex flex-col border border-base-200/60">
                                    {/* Product Image */}
                                    <div className="relative h-16 overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.photo || "/api/placeholder/200/200"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Stock Badge */}
                                        <div className="absolute top-0.5 right-0.5">
                                            {product.inStock ? (
                                                <div className="badge badge-success badge-xs text-white text-[8px] px-0.5 py-0.5 h-3 min-h-3">In</div>
                                            ) : (
                                                <div className="badge badge-error badge-xs text-white text-[8px] px-0.5 py-0.5 h-3 min-h-3">Out</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Name */}
                                    <div className="flex-1 flex items-center justify-center p-1.5">
                                        <h3 className="font-medium text-[9px] text-center group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {product.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>            {/* Compact Navigation Controls */}
            {products.length > productsPerView && (
                <div className="flex justify-center items-center mt-2 space-x-1">
                    <button
                        onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : products.length - 1)}
                        className="btn btn-circle btn-xs btn-outline h-5 w-5 min-h-5"
                    >
                        ❮
                    </button>
                    
                    {/* Dots */}
                    <div className="flex space-x-1 px-1">
                        {Array.from({ length: Math.ceil(products.length / productsPerView) }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index * productsPerView)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                                    Math.floor(currentIndex / productsPerView) === index
                                        ? 'bg-primary'
                                        : 'bg-base-300 hover:bg-base-400'
                                }`}
                            />
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setCurrentIndex(prev => (prev + 1) % products.length)}
                        className="btn btn-circle btn-xs btn-outline h-5 w-5 min-h-5"
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;