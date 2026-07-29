/**
 * NOUS ART — Cloudflare R2 Upload Worker
 * ========================================
 * Deploy this Worker to Cloudflare to enable real R2 file uploads
 * AND JSON metadata storage for the CMS.
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
 *
 * Supported operations:
 *   - POST   (FormData)          → Upload a file (image/video) to R2
 *   - DELETE (JSON body)         → Delete a file from R2
 *   - GET    (?key=cms/xxx.json) → Read a CMS JSON metadata file from R2
 *   - PUT    (JSON body)         → Write a CMS JSON metadata file to R2
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // ─── CORS Preflight ─────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ─── GET: Read a CMS JSON metadata file from R2 ─────────────────────
    if (request.method === 'GET') {
      try {
        const url = new URL(request.url);
        const key = url.searchParams.get('key');

        if (!key) {
          return new Response(
            JSON.stringify({ error: 'Missing "key" query parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const object = await env.MEDIA_BUCKET.get(key);

        if (!object) {
          return new Response(
            JSON.stringify({ error: 'Not found', key }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const body = await object.text();

        return new Response(body, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err) }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ─── PUT: Write a CMS JSON metadata file to R2 ──────────────────────
    if (request.method === 'PUT') {
      try {
        const body = await request.json();
        const { key, data } = body;

        if (!key || data === undefined) {
          return new Response(
            JSON.stringify({ error: 'Missing "key" or "data" in request body' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const jsonString = JSON.stringify(data);

        await env.MEDIA_BUCKET.put(key, jsonString, {
          httpMetadata: { contentType: 'application/json' },
        });

        return new Response(
          JSON.stringify({ success: true, key, size: jsonString.length }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err) }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ─── POST: Upload a file (image/video) to R2 ────────────────────────
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

    // ─── DELETE: Remove a file from R2 ──────────────────────────────────
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
