import 'dotenv/config';

const readEnv = (key: string, fallback = ''): string => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const onVercel = Boolean(process.env.VERCEL);

const rawViteSupabaseUrl = process.env.VITE_SUPABASE_URL ?? '';
const rawViteSupabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? '';

const serverSupabaseUrl = readEnv('SUPABASE_URL');
const serverSupabaseAnonKey = readEnv('SUPABASE_ANON_KEY');

const effectiveSupabaseUrl =
  serverSupabaseUrl || (onVercel ? '' : readEnv('VITE_SUPABASE_URL'));
const effectiveSupabaseAnonKey =
  serverSupabaseAnonKey || (onVercel ? '' : readEnv('VITE_SUPABASE_ANON_KEY'));

if (onVercel && rawViteSupabaseUrl && !serverSupabaseUrl) {
  console.warn(
    '[config] VITE_SUPABASE_URL is configured but SUPABASE_URL is missing. ' +
    'On Vercel, VITE_* env vars are stripped from serverless functions. Add ' +
    'SUPABASE_URL (same value as VITE_SUPABASE_URL) to your Vercel project env ' +
    'so the public API routes can read published articles from Supabase.',
  );
}
if (onVercel && rawViteSupabaseAnonKey && !serverSupabaseAnonKey) {
  console.warn(
    '[config] VITE_SUPABASE_ANON_KEY is configured but SUPABASE_ANON_KEY is missing. ' +
    'On Vercel, VITE_* env vars are stripped from serverless functions. Add ' +
    'SUPABASE_ANON_KEY (same value as VITE_SUPABASE_ANON_KEY) to your Vercel project env ' +
    'so the public API routes can read published articles from Supabase.',
  );
}

export const config = {
  APP_URL: readEnv('APP_URL', 'http://localhost:4100'),
  ADMIN_USERNAME: readEnv('ADMIN_USERNAME', 'Glint'),
  ADMIN_EMAIL: readEnv('ADMIN_EMAIL', 'martins14747@gmail.com'),
  CONTACT_RECIPIENT_EMAIL: readEnv('CONTACT_RECIPIENT_EMAIL', readEnv('ADMIN_EMAIL', 'martins14747@gmail.com')),
  DATABASE_URL: readEnv('DATABASE_URL'),
  SUPABASE_URL: effectiveSupabaseUrl,
  SUPABASE_ANON_KEY: effectiveSupabaseAnonKey,
  RESEND_API_KEY: readEnv('RESEND_API_KEY'),
  RESEND_FROM_EMAIL: readEnv('RESEND_FROM_EMAIL', 'onboarding@resend.dev'),
  RESEND_FROM_NAME: readEnv('RESEND_FROM_NAME', 'NexTake Desk'),
  SESSION_SECRET: readEnv('SESSION_SECRET', 'nextedit-dev-secret-change-me'),
  NODE_ENV: readEnv('NODE_ENV', 'development'),
  PORT: Number(readEnv('PORT', '4101')),
  HOST: readEnv('HOST', '0.0.0.0'),
};

export const isProduction = config.NODE_ENV === 'production';
