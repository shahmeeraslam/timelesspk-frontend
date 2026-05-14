import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image = "/assets/og-default.jpg", // Default system image
  url = "", 
  type = "website" 
}) => {
  const siteTitle = "VANGUARD";
  // Themed title format: NODE_NAME // VANGUARD
  const fullTitle = title ? `${title.toUpperCase()} // ${siteTitle}` : `${siteTitle} // ARCHIVE_CORE`;
  const defaultDesc = "System Access: High-performance technical wear and archive units. Reengineered for the modern terminal.";

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={`https://vanguard.com${url}`} />

      {/* Open Graph / Social (The HUD preview) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`https://vanguard.com${url}`} />
      <meta property="og:type" content={type} />

      {/* Twitter Manifest */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;