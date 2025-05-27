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
    }, [getAllProducts]);

    // Handle responsive products per view
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setProductsPerView(2); // Mobile: 2 products
            } else if (width < 1024) {
                setProductsPerView(3); // Tablet: 3 products
            } else if (width < 1280) {
                setProductsPerView(4); // Large tablet/small desktop: 4 products
            } else {
                setProductsPerView(5); // Desktop: 5 products
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
    }, [currentIndex, products, productsPerView]);

    if (isLoading) {
        return (
            <div className="w-full mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
                <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="w-full mb-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
                <div className="text-center py-8">
                    <p className="text-base-content/60">No products available</p>
                </div>
            </div>
        );
    }    return (
        <div className="w-full mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
              {/* Carousel Container */}
            <div className="relative overflow-hidden">
                {/* Container for products - responsive grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {visibleProducts.map((product, index) => (
                        <div key={`${product._id}-${currentIndex}-${index}`} className="w-full">
                            <Link 
                                to={`/products/${product._id}`}
                                className="block group"
                            >
                                {/* Product Card - 4x4 Size */}
                                <div className="bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105 aspect-square">
                                    {/* Product Image */}
                                    <div className="relative h-3/4 overflow-hidden">
                                        <img
                                            src={product.photo || "/api/placeholder/200/200"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Stock Badge */}
                                        <div className="absolute top-2 right-2">
                                            {product.inStock ? (
                                                <div className="badge badge-success badge-sm">In Stock</div>
                                            ) : (
                                                <div className="badge badge-error badge-sm">Out of Stock</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Name */}
                                    <div className="h-1/4 flex items-center justify-center p-2">
                                        <h3 className="font-semibold text-sm text-center group-hover:text-primary transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            {products.length > productsPerView && (
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: Math.ceil(products.length / productsPerView) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index * productsPerView)}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                Math.floor(currentIndex / productsPerView) === index
                                    ? 'bg-primary'
                                    : 'bg-base-300 hover:bg-base-400'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Manual Navigation Arrows */}
            {products.length > productsPerView && (
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : products.length - 1)}
                        className="btn btn-circle btn-sm btn-outline"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => setCurrentIndex(prev => (prev + 1) % products.length)}
                        className="btn btn-circle btn-sm btn-outline"
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductCarousel;