import { createClient } from '@supabase/supabase-js';

// Use Vite env vars when available; otherwise fall back to the keys you provided.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wfittbzilafvmvmklhcd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaXR0YnppbGFmdm12bWtsaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Njg1NDAsImV4cCI6MjA4NzI0NDU0MH0.PtVcBzl92ru81adNdYUiD57eu4S2ARZWNDHHNXQ6q7s';
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pnx_1KzATdkJQdSp-ySwug_xJ0L2VXg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
