import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tbcjvfkoisnibvlfhhkw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY2p2ZmtvaXNuaWJ2bGZoaGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDgwNDIsImV4cCI6MjEwMDUyNDA0Mn0.Di9gf6zKLfEXH4nPyem0Hy8jGp2uUXVaQBPR33mW4w8'
);

async function run() {
  const { data, error } = await supabase.from('art_pieces').select('id, title, image_url');
  console.log(JSON.stringify(data, null, 2));
}

run();
