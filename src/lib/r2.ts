import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID as string | undefined;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY as string | undefined;
const bucketName = import.meta.env.VITE_R2_BUCKET_NAME as string | undefined;
const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL as string | undefined;

/**
 * Checks if all required Cloudflare R2 environment variables are defined.
 */
export function isR2Configured(): boolean {
  return Boolean(
    accountId &&
    accessKeyId &&
    secretAccessKey &&
    bucketName &&
    publicUrl &&
    !accountId.includes('votre_')
  );
}

/**
 * Creates and returns an S3 client configured for Cloudflare R2.
 */
function getR2Client(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 environment variables are missing.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads a File to Cloudflare R2 and returns its public URL.
 * 
 * @param file The file object to upload
 * @param folder Optional subfolder prefix (e.g. "artworks" or "hero")
 * @returns Public URL of the uploaded file
 */
export async function uploadToR2(file: File, folder: string = 'media'): Promise<string> {
  if (!isR2Configured()) {
    throw new Error('Cloudflare R2 is not configured in environment variables.');
  }

  const client = getR2Client();
  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: file.type || 'application/octet-stream',
  });

  await client.send(command);

  const baseUrl = (publicUrl || '').replace(/\/$/, '');
  return `${baseUrl}/${fileName}`;
}
