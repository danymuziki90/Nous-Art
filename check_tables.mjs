import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tbcjvfkoisnibvlfhhkw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY2p2ZmtvaXNuaWJ2bGZoaGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDgwNDIsImV4cCI6MjEwMDUyNDA0Mn0.Di9gf6zKLfEXH4nPyem0Hy8jGp2uUXVaQBPR33mW4w8'
);

async function run() {
  console.log('Querying art_pieces...');
  const { data: artData, error: artError } = await supabase.from('art_pieces').select('*');
  if (artError) {
    console.error('Error querying art_pieces:', artError);
  } else {
    console.log(`Successfully queried art_pieces. Found ${artData.length} records.`);
  }

  console.log('Querying site_settings...');
  const { data: siteData, error: siteError } = await supabase.from('site_settings').select('*');
  if (siteError) {
    console.error('Error querying site_settings:', siteError);
  } else {
    console.log(`Successfully queried site_settings. Found ${siteData.length} records:`, siteData);
  }
}

run();
