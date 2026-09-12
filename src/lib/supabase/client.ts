import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gmjpudilgpoounjjjpos.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtanB1ZGlsZ3Bvb3VuampqcG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNDA2MjgsImV4cCI6MjEwNDgxNjYyOH0.SzMVF0GHvr1d0H6McKerOfIfyHKtArE-TQb2cvlOJp8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
