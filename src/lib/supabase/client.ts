import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fitbuvxhovynlecwmdrc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdGJ1dnhob3Z5bmxlY3dtZHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjcyNjgsImV4cCI6MjEwNDQ0MzI2OH0.f9JK5cIiB_nG1YIasyawthoKhpzRNwWg9J-Jg6WA5AM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
