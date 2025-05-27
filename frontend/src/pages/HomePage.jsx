
import ProductCarousel from '../components/ProductCarousel';

const HomePage = () => {

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Product Carousel */}
          <div className="p-6">
            <ProductCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
