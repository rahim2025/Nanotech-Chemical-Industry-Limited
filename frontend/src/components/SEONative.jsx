import { useEffect } from 'react';

const SEONative = ({ 
  title = "Nanotech Chemical Industry Limited - Leading Chemical Manufacturing Company",
  description = "Nanotech Chemical Industry Limited is a premier chemical manufacturing company specializing in high-quality industrial chemicals, research chemicals, and custom chemical solutions. Located in Guangzhou and Hong Kong.",
  keywords = "chemical manufacturing, industrial chemicals, research chemicals, nanotech chemicals, chemical solutions, Guangzhou chemicals, Hong Kong chemicals, chemical industry, chemical products",
  image = "https://nanotechchemical.com/logo-og.png",
  url = "https://nanotechchemical.com/",
  type = "website",
  schemaData = null
}) => {
  const fullTitle = title.includes('Nanotech Chemical') ? title : `${title} | Nanotech Chemical Industry Limited`;
  
  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Helper function to update meta tags
    const updateMetaTag = (selector, content, property = 'content') => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.includes('property=')) {
          meta.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          meta.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute(property, content);
    };

    // Update primary meta tags
    updateMetaTag('meta[name="title"]', fullTitle);
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:url"]', url);
    updateMetaTag('meta[property="og:title"]', fullTitle);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', image);
    updateMetaTag('meta[property="og:image:secure_url"]', image);

    // Update Twitter tags
    updateMetaTag('meta[property="twitter:url"]', url);
    updateMetaTag('meta[property="twitter:title"]', fullTitle);
    updateMetaTag('meta[property="twitter:description"]', description);
    updateMetaTag('meta[property="twitter:image"]', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data if provided
    if (schemaData) {
      let script = document.querySelector('script[type="application/ld+json"][data-dynamic]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-dynamic', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaData);
    }

  }, [fullTitle, description, keywords, image, url, type, schemaData]);

  return null; // This component doesn't render anything
};

export default SEONative;
