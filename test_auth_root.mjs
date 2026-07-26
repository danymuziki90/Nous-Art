import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tbcjvfkoisnibvlfhhkw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY2p2ZmtvaXNuaWJ2bGZoaGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDgwNDIsImV4cCI6MjEwMDUyNDA0Mn0.Di9gf6zKLfEXH4nPyem0Hy8jGp2uUXVaQBPR33mW4w8'
);

async function run() {
  console.log('Attempting sign in...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123'
  });
  if (error) {
    console.error('Sign in failed with error:', error);
  } else {
    console.log('Sign in response:', data);
  }
}

run();
