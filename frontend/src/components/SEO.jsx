import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Nanotech Chemical Industry Limited - Leading Chemical Manufacturing Company",
  description = "Nanotech Chemical Industry Limited is a premier chemical manufacturing company specializing in high-quality industrial chemicals, research chemicals, and custom chemical solutions. Located in Guangzhou and Hong Kong.",
  keywords = "chemical manufacturing, industrial chemicals, research chemicals, nanotech chemicals, chemical solutions, Guangzhou chemicals, Hong Kong chemicals, chemical industry, chemical products",
  image = "https://nanotechchemical.com/logo-og.png",
  url = "https://nanotechchemical.com/",
  type = "website",
  schemaData = null
}) => {
  const fullTitle = title.includes('Nanotech Chemical') ? title : `${title} | Nanotech Chemical Industry Limited`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Nanotech Chemical Industry Limited" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Nanotech Chemical Industry Limited Logo" />
      <meta property="og:site_name" content="Nanotech Chemical Industry Limited" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:image:alt" content="Nanotech Chemical Industry Limited Logo" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Additional Schema Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
