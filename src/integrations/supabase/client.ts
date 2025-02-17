
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ojukpyrqlkwqywxcrdnu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdWtweXJxbGt3cXl3eGNyZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjI3MjAsImV4cCI6MjA1NTM5ODcyMH0.bIGtuXMBeKb2CWMVZ--AyvPfD9P2eL9AExPwhzFebEo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
