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

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
const endpoint = `${url}/auth/v1/signup`;
const body = {
  email: `debug-${Date.now()}@example.com`,
  password: '123456',
  options: {
    data: { full_name: 'Debug Test', cargo: 'Tester' }
  }
};

(async () => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log('status', res.status);
  console.log('headers', Object.fromEntries(res.headers.entries()));
  console.log('body', text);
})();
