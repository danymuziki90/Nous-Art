/**
 * Cloudflare R2 Storage Integration
 *
 * Upload flow:
 *  1. If VITE_R2_UPLOAD_WORKER_URL is set → POST to your Cloudflare Worker (secure, recommended for production)
 *  2. Otherwise → encode the file as a compressed Data URL stored in localStorage (dev/demo fallback)
 *
 * To enable real R2 uploads, deploy the Worker in `/workers/r2-upload-worker.js`
 * and set VITE_R2_UPLOAD_WORKER_URL in your .env file.
 */

const R2_PUBLIC_BASE_URL =
  (import.meta.env.VITE_R2_PUBLIC_URL as string | undefined) ||
  'https://pub-ab97513db1374095a12037d387074918.r2.dev';

const R2_UPLOAD_WORKER_URL = import.meta.env.VITE_R2_UPLOAD_WORKER_URL as string | undefined;

// Max size for Data URL fallback (in bytes) — 800KB to stay well within localStorage limits
const MAX_DATAURL_BYTES = 800 * 1024;

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
 * Compresses an image File to a JPEG Data URL within the given byte limit.
 * Iteratively reduces quality and dimensions until it fits.
 */
async function compressImageToDataURL(
  file: File,
  maxBytes: number = MAX_DATAURL_BYTES
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      let quality = 0.82;
      let scale = 1.0;
      let result = '';

      // Try reducing quality and scale until the output fits
      const tryCompress = () => {
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        result = canvas.toDataURL('image/jpeg', quality);

        const bytes = Math.round((result.length * 3) / 4);
        if (bytes <= maxBytes || (quality <= 0.3 && scale <= 0.3)) {
          resolve(result);
        } else {
          if (quality > 0.35) {
            quality -= 0.12;
          } else {
            scale = Math.max(0.25, scale - 0.15);
            quality = 0.72;
          }
          tryCompress();
        }
      };

      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a file to Cloudflare R2 via a secure Worker endpoint.
 * Falls back to a compressed Data URL if no Worker URL is configured.
 *
 * @param file   - The File object to upload
 * @param folder - Destination folder prefix in the R2 bucket (e.g. 'artworks', 'hero')
 * @returns A public URL pointing to the uploaded resource
 */
export async function uploadToR2(file: File, folder: string = 'media'): Promise<string> {
  // ─── Path A: Real Cloudflare Worker Upload ────────────────────────────────
  if (R2_UPLOAD_WORKER_URL) {
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '');
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `${safeFolder}/${timestamp}-${safeName}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', objectKey);

    const response = await fetch(R2_UPLOAD_WORKER_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`R2 upload failed (${response.status}): ${errorText}`);
    }

    const data = await response.json() as { url?: string; key?: string };

    // Sanitize URL — strip any whitespace/newlines from Worker env var formatting issues
    const sanitize = (s: string) => s.replace(/[\r\n\s]+/g, '');

    // Prefer the Worker-returned URL; fall back to constructing it from the key
    if (data.url) return sanitize(data.url);
    if (data.key) return getR2MediaUrl(sanitize(data.key));

    const baseUrl = R2_PUBLIC_BASE_URL.replace(/\/+$/, '');
    return `${baseUrl}/${objectKey}`;
  }

  // ─── Path B: Local Dev / Demo fallback — compressed Data URL ─────────────
  console.warn(
    '[r2Storage] VITE_R2_UPLOAD_WORKER_URL is not set. ' +
    'Falling back to compressed Data URL stored in localStorage. ' +
    'Deploy the Worker and add the env variable for real R2 uploads.'
  );

  try {
    return await compressImageToDataURL(file, MAX_DATAURL_BYTES);
  } catch (err) {
    throw new Error(
      `Image compression failed: ${err instanceof Error ? err.message : String(err)}. ` +
      'Please provide a direct image URL instead.'
    );
  }
}

/**
 * Deletes a file from Cloudflare R2 via a secure Worker endpoint.
 * In fallback mode (no Worker), this is a no-op (Data URLs are not stored remotely).
 */
export async function deleteFromR2(path: string): Promise<boolean> {
  if (!R2_UPLOAD_WORKER_URL) {
    console.log(`[r2Storage] Fallback mode — skipping delete for: ${path}`);
    return true;
  }

  if (!isR2Url(path)) {
    return true; // Not an R2 resource, nothing to delete
  }

  try {
    const response = await fetch(R2_UPLOAD_WORKER_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: path }),
    });

    return response.ok;
  } catch (err) {
    console.error('[r2Storage] Delete error:', err);
    return false;
  }
}
