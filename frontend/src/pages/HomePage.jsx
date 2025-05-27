
import ProductCarousel from '../components/ProductCarousel';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-200 pt-20">
      {/* Featured Products - Moved to top, right below navbar */}
      <section className="py-4 bg-gradient-to-r from-base-100 via-base-200 to-base-100 border-b border-base-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <div className="size-6 rounded-full overflow-hidden bg-white border border-primary/30">
                <img 
                  src="/logo.png" 
                  alt="Nanotech Chemical Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              Featured Products
            </h2>
            <Link to="/" className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="max-w-full mx-auto">
            <ProductCarousel />
          </div>
        </div>
      </section>
      
      {/* Header section with logo */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-full overflow-hidden bg-white border-2 border-primary/30 shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="Nanotech Chemical Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-12 border-l-2 border-primary/30"></div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-primary">Est. 2009</div>
                <div className="text-xs text-base-content/60">Nanotechnology Excellence</div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-base-content leading-tight">
              Nanotech Chemical
              <span className="text-primary block">Industry Limited</span>
            </h1>
            
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto mt-4 mb-8">
              Leading manufacturer of advanced nanomaterials and chemical solutions. 
              Pioneering innovation in nanotechnology for a sustainable future.
            </p>
              <Link to="/" className="btn btn-primary btn-lg gap-2">
              Explore Our Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;