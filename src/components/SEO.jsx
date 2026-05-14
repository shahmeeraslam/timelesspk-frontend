import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  // Pointing to root since it's in the public folder
  image = "/classic-vintage-retro-western-badge-logo-design-inspiration-free-vector.webp", 
  url = "", 
  type = "website" 
}) => {
  const siteTitle = "VANGUARD";
  const baseUrl = "https://timelesspk-frontend.vercel.app";

  // Themed title format: NODE_NAME // VANGUARD
  const fullTitle = title 
    ? `${title.toUpperCase()} // ${siteTitle}` 
    : `${siteTitle} // ARCHIVE_CORE`;

  const defaultDesc = "System Access: High-performance technical wear and archive units. Reengineered for the modern terminal.";

  // Ensure image URL is absolute for WhatsApp/Social crawlers
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return (
    <Helmet>
      {/* --- STANDARD METADATA --- */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={`${baseUrl}${url}`} />

      {/* --- OPEN GRAPH / WHATSAPP HUD --- */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={`${baseUrl}${url}`} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* --- TWITTER DATA --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SEO;