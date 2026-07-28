/**
 * NOUS ART — Cloudflare R2 Upload Worker
 * ========================================
 * Deploy this Worker to Cloudflare to enable real R2 file uploads.
 *
 * Setup:
 *  1. Create a Cloudflare Worker at https://dash.cloudflare.com/workers
 *  2. Bind your R2 bucket: Worker Settings → R2 Bucket Bindings → name it "MEDIA_BUCKET"
 *  3. Set the R2_PUBLIC_URL environment variable in the Worker settings
 *  4. Copy this file content into the Worker editor
 *  5. Deploy the Worker — note its URL (e.g. https://nous-art-r2.your-name.workers.dev)
 *  6. In your .env file, add:
 *       VITE_R2_UPLOAD_WORKER_URL=https://nous-art-r2.your-name.workers.dev
 *
 * Environment variables required in the Worker dashboard:
 *   - R2_PUBLIC_URL: Your R2 public bucket URL (e.g. https://pub-xxxx.r2.dev)
 *
 * R2 Bucket binding:
 *   - Name: MEDIA_BUCKET (must match the binding name in the Worker settings)
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const key = formData.get('key');

        if (!file || typeof key !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Missing "file" or "key" in form data' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const buffer = await file.arrayBuffer();
        await env.MEDIA_BUCKET.put(key, buffer, {
          httpMetadata: { contentType: file.type || 'application/octet-stream' },
        });

        const baseUrl = (env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
        const publicUrl = `${baseUrl}/${key}`;

        return new Response(
          JSON.stringify({ url: publicUrl, key }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err) }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (request.method === 'DELETE') {
      try {
        const body = await request.json();
        const url = body?.url;
        if (!url) {
          return new Response(
            JSON.stringify({ error: 'Missing "url" in request body' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const baseUrl = (env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
        const key = url.replace(baseUrl + '/', '');
        await env.MEDIA_BUCKET.delete(key);
        return new Response(
          JSON.stringify({ deleted: key }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err) }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  },
};
