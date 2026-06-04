/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : ({
        auth: {
          signInWithPassword: async () => ({
            data: null,
            error: {
              message: 'Supabase não está configurado. Verifique o arquivo .env.',
              status: 400,
            },
          }),
        },
      } as any);
