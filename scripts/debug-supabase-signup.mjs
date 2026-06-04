import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf-8').split('\n').reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const [key, ...rest] = trimmed.split('=');
  acc[key.trim()] = rest.join('=').trim();
  return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  try {
    const { data, error } = await supabase.auth.signUp(
      { email: 'debug-test@example.com', password: '123456' },
      { data: { full_name: 'Debug Test', cargo: 'Tester' } }
    );
    console.log('data', JSON.stringify(data, null, 2));
    console.log('error', error);
  } catch (err) {
    console.error('exception', err);
  }
})();
