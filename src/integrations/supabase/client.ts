import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rqassaxkbntpcwhvevyi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wQYmWnV_DbEAyMYgyEKh9g_xyv4Da7K";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
