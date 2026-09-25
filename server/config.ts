import 'dotenv/config';

const readEnv = (key: string, fallback = ''): string => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
};

export const config = {
  APP_URL: readEnv('APP_URL', 'http://localhost:4100'),
  ADMIN_USERNAME: readEnv('ADMIN_USERNAME', 'Glint'),
  ADMIN_EMAIL: readEnv('ADMIN_EMAIL', 'martins14747@gmail.com'),
  DATABASE_URL: readEnv('DATABASE_URL'),
  RESEND_API_KEY: readEnv('RESEND_API_KEY'),
  RESEND_FROM_EMAIL: readEnv('RESEND_FROM_EMAIL', 'onboarding@resend.dev'),
  RESEND_FROM_NAME: readEnv('RESEND_FROM_NAME', 'NextEdit Admin'),
  SESSION_SECRET: readEnv('SESSION_SECRET', 'nextedit-dev-secret-change-me'),
  NODE_ENV: readEnv('NODE_ENV', 'development'),
  PORT: Number(readEnv('PORT', '4101')),
  HOST: readEnv('HOST', '0.0.0.0'),
};

export const isProduction = config.NODE_ENV === 'production';
