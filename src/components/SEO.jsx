import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image = "/classic-vintage-retro-western-badge-logo-design-inspiration-free-vector.webp", 
  url = "", 
  type = "website" 
}) => {
  const siteTitle = "VANGUARD";
  const baseUrl = "https://timelesspk-frontend.vercel.app";

  // --- ERROR PREVENTION LOGIC ---
  // 1. Extract the first image if it's an array, or fallback to default if null/undefined
  const rawImage = Array.isArray(image) ? image[0] : image;
  const safeImage = typeof rawImage === 'string' ? rawImage : "/classic-vintage-retro-western-badge-logo-design-inspiration-free-vector.webp";

  // 2. Ensure the URL is absolute for social crawlers
  const fullImageUrl = safeImage.startsWith('http') 
    ? safeImage 
    : `${baseUrl}${safeImage.startsWith('/') ? '' : '/'}${safeImage}`;

  // Themed title format
  const fullTitle = title 
    ? `${title.toUpperCase()} // ${siteTitle}` 
    : `${siteTitle} // ARCHIVE_CORE`;

  const defaultDesc = "System Access: High-performance technical wear and archive units. Reengineered for the modern terminal.";

  return (
    <Helmet>
      {/* --- STANDARD METADATA --- */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={`${baseUrl}${url}`} />

      {/* --- OPEN GRAPH / SOCIAL PREVIEW --- */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={`${baseUrl}${url}`} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* --- TWITTER --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SEO;