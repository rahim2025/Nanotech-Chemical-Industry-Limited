import ProductCarousel from '../components/ProductCarousel';
import SEO from '../components/SEO';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const homeSchemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nanotech Chemical Industry Limited",
    "alternateName": "Nanotech Chemical",
    "url": "https://nanotechchemical.com",
    "logo": "https://nanotechchemical.com/logo.png",
    "description": "Premier chemical manufacturing company specializing in high-quality industrial chemicals, research chemicals, and custom chemical solutions.",
    "foundingDate": "2020",
    "industry": "Chemical Manufacturing",
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Room 1501, 15/F, Tower B, Billion Centre",
        "addressLocality": "Kwun Tong",
        "addressRegion": "Kowloon",
        "addressCountry": "Hong Kong"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Room 2301, 23/F, China Merchants Tower",
        "addressLocality": "Tianhe District",
        "addressRegion": "Guangzhou",
        "addressCountry": "China"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+852 3175 1234",
        "contactType": "Customer Service",
        "areaServed": "HK"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+86 20 8888 9999",
        "contactType": "Customer Service",
        "areaServed": "CN"
      }
    ],
    "email": "info@nanotechchemical.com",
    "sameAs": [
      "https://nanotechchemical.com"
    ]
  };

  return (
    <>
      <SEO 
        title="Nanotech Chemical Industry Limited - Leading Chemical Manufacturing Company"
        description="Premier chemical manufacturing company specializing in high-quality industrial chemicals, research chemicals, and custom chemical solutions. Located in Guangzhou and Hong Kong."
        url="https://nanotechchemical.com/"
        schemaData={homeSchemaData}
      />
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
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-12 gap-4 md:gap-8">
            <div className="flex flex-col xs:flex-row items-center gap-4 mb-6 md:mb-0">
              <div className="w-16 h-16 xs:w-12 xs:h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-white border-2 border-primary/30 shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="Nanotech Chemical Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xs:block h-8 md:h-12 border-l-2 border-primary/30"></div>
              <div className="space-y-1 text-center xs:text-left">
                <div className="text-xs xs:text-sm font-medium text-primary">Nanotech</div>
                <div className="text-xs text-base-content/60">Nanotechnology Excellence</div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-base-content leading-tight">
                Nanotech Chemical
                <span className="text-primary block">Industry Limited</span>
              </h1>
              <p className="text-base xs:text-lg text-base-content/70 max-w-2xl mx-auto md:mx-0 mt-4 mb-8">
                Leading manufacturer of advanced nanomaterials and chemical solutions. 
                Pioneering innovation in nanotechnology for a sustainable future.
              </p>
              <Link to="/" className="btn btn-primary btn-md xs:btn-lg gap-2 w-full xs:w-auto">
                Explore Our Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};
export default HomePage;