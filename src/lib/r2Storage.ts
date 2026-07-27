const R2_PUBLIC_BASE_URL =
  (import.meta.env.VITE_R2_PUBLIC_URL as string | undefined) ||
  'https://pub-ab97513db1374095a12037d387074918.r2.dev';

/**
  * Resolves a media file path to a Cloudflare R2 public CDN URL.
  * Handles both raw filenames (e.g. 'artworks/reverie.jpg') and full HTTP URLs.
  */
export function getR2MediaUrl(path: string | null | undefined): string {
  if (!path) return '';

  // If already an absolute HTTP/HTTPS URL (e.g. Pexels/Unsplash fallback or direct R2 CDN URL), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Sanitize leading slashes
  const cleanPath = path.replace(/^\/+/, '');
  const baseUrl = R2_PUBLIC_BASE_URL.replace(/\/+$/, '');

  return `${baseUrl}/${cleanPath}`;
}

/**
  * Helper to check if a URL is hosted on Cloudflare R2.
  */
export function isR2Url(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('r2.dev') || url.includes('cloudflarestorage.com');
}
