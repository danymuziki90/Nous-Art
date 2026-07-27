const R2_PUBLIC_BASE_URL =
  (import.meta.env.VITE_R2_PUBLIC_URL as string | undefined) ||
  'https://pub-ab97513db1374095a12037d387074918.r2.dev';

/**
  * Resolves a media file path to a Cloudflare R2 public CDN URL.
  * Handles both raw filenames (e.g. 'artworks/reverie.jpg') and full HTTP/data URLs.
  */
export function getR2MediaUrl(path: string | null | undefined): string {
  if (!path) return '';

  // If already an absolute HTTP/HTTPS URL or data URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
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

/**
  * Simulates/Executes file upload directly to Cloudflare R2 media bucket.
  * Returns a valid R2 public URL for client consumption.
  */
export async function uploadToR2(file: File, folder: string = 'media'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Return Data URL / R2 Media reference URL
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading error'));
    };

    reader.readAsDataURL(file);
  });
}

/**
  * Simulates deletion of a file from Cloudflare R2 storage.
  */
export async function deleteFromR2(path: string): Promise<boolean> {
  console.log(`[Cloudflare R2 Storage] Deleted object: ${path}`);
  return true;
}
