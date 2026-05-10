import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxbbribgjrrdwgmzefvc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4YmJyaWJnanJyZHdnbXplZnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDQzMTYsImV4cCI6MjA5Mzk4MDMxNn0.LYg60TmOt30OR9fZDOoZxoePiHauEFmekLdS9NYOY-c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
