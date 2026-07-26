import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "NOUS ART — Contemporary Art Gallery",
  description = "A curated gallery of contemporary art. Discover, collect, and explore exceptional works by emerging and established masters.",
  image = "https://nousart.gallery/img/logo.jpeg?v=2",
  url = "https://nousart.gallery",
}: SEOProps) {
  // Ensure the image URL is absolute (required by WhatsApp/LinkedIn)
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `https://nousart.gallery${image.startsWith('/') ? '' : '/'}${image}`;

  // Ensure the canonical URL is absolute
  const absoluteUrl = url.startsWith('http')
    ? url
    : `https://nousart.gallery${url.startsWith('/') ? '' : '/'}${url}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={absoluteUrl} />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="NOUS ART" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
}
