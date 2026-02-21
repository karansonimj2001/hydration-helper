import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wfittbzilafvmvmklhcd.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXR0YnppbGFmdm12bWtsaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Njg1NDAsImV4cCI6MjA4NzI0NDU0MH0.PtVcBzl92ru81adNdYUiD57eu4S2ARZWNDHHNXQ6q7s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const timestamp = Date.now();
  const password = `TestPass!${Math.floor(Math.random() * 9000) + 1000}`;

  const emails = [
    `test${timestamp}@example.com`,
    `test${timestamp}@mailinator.com`,
    `test+${timestamp}@example.com`,
    `test.${timestamp}@example.org`,
  ];

  console.log('Testing Supabase auth for', SUPABASE_URL);

  for (const email of emails) {
    console.log('\n--- Trying', email);
    const signUp = await supabase.auth.signUp({ email, password });
    console.log('signUp:', {
      status: signUp.error?.status || null,
      code: signUp.error?.code || null,
      message: signUp.error?.message || null,
    });

    const signIn = await supabase.auth.signInWithPassword({ email, password });
    console.log('signIn:', {
      status: signIn.error?.status || null,
      code: signIn.error?.code || null,
      message: signIn.error?.message || null,
    });
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
