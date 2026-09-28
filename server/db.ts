import pg from 'pg';
import { config } from './config';

let isDbAvailable = false;

export const pool = config.DATABASE_URL
  ? new pg.Pool({
      connectionString: config.DATABASE_URL,
      ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 3000,
    })
  : null;

if (pool) {
  pool.on('error', (err) => {
    console.warn('[db] Unexpected pool error:', err.message);
    isDbAvailable = false;
  });
}

export const initializeDatabase = async () => {
  if (!pool) {
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        body TEXT NOT NULL,
        content_type TEXT NOT NULL,
        status TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT[] DEFAULT '{}',
        cover_image TEXT,
        external_link TEXT,
        video_url TEXT,
        scheduled_for TIMESTAMPTZ,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        featured_priority INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS media (
        id UUID PRIMARY KEY,
        original_filename TEXT NOT NULL,
        storage_key TEXT NOT NULL UNIQUE,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        provider TEXT NOT NULL DEFAULT 'local',
        url TEXT NOT NULL,
        content_id UUID,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_content
          FOREIGN KEY (content_id)
          REFERENCES content(id)
          ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY,
        content_id UUID,
        event_type TEXT NOT NULL,
        event_value INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS editorial_overrides (
        id UUID PRIMARY KEY,
        content_id UUID NOT NULL,
        slot TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 0,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    isDbAvailable = true;
    console.log('[db] PostgreSQL initialized successfully.');
  } catch (err: any) {
    isDbAvailable = false;
    console.warn('[db] Database connection failed, using in-memory mode:', err.message);
  }
};

export const isDatabaseEnabled = () => Boolean(pool && isDbAvailable);
