import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tbcjvfkoisnibvlfhhkw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY2p2ZmtvaXNuaWJ2bGZoaGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDgwNDIsImV4cCI6MjEwMDUyNDA0Mn0.Di9gf6zKLfEXH4nPyem0Hy8jGp2uUXVaQBPR33mW4w8'
);

async function run() {
  const { data, error } = await supabase
    .from('art_pieces')
    .update({ image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop' })
    .eq('id', '83f4222f-d301-47d8-ae4e-1248e60b8293');
  
  console.log("Updated", error);
}

run();
