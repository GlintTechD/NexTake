/**
 * supabase-content.ts
 *
 * Reads published articles from the shared Supabase project that the
 * NexTake-Admin CMS writes to. This file is only used when SUPABASE_URL
 * and SUPABASE_ANON_KEY are present in the environment.
 *
 * The Supabase `articles` table shape is:
 *   id, slug, title, summary/excerpt, content/syndicated_body, author,
 *   category, tags, cover_image_url/image, video_url, content_type,
 *   status, published_at, created_at, updated_at
 *
 * We normalise that into the server's ContentRecord shape so the rest of
 * index.ts needs no changes.
 */

import { config } from './config';
import type { ContentRecord } from './content';

const COLUMNS = [
  'id',
  'slug',
  'title',
  'summary',
  'excerpt',
  'content',
  'syndicated_body',
  'author',
  'original_author',
  'category',
  'tags',
  'cover_image_url',
  'image',
  'video_url',
  'content_type',
  'status',
  'published_at',
  'created_at',
  'updated_at',
].join(',');

type ArticleRow = Record<string, unknown>;

/** Converts an `articles` DB row into the server's ContentRecord shape. */
function rowToContentRecord(row: ArticleRow): ContentRecord {
  const str = (v: unknown, fallback = '') =>
    v == null ? fallback : String(v);

  const tags = (() => {
    const raw = row.tags;
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        return raw.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }
    return [];
  })();

  const contentType = (() => {
    const raw = str(row.content_type, 'blog');
    if (raw === 'media') return 'media' as const;
    if (raw === 'event') return 'event' as const;
    if (raw === 'news') return 'news' as const;
    if (raw === 'announcement') return 'announcement' as const;
    if (raw === 'project') return 'project' as const;
    if (raw === 'opportunity') return 'opportunity' as const;
    return 'blog' as const;
  })();

  const status = (() => {
    const raw = str(row.status, 'draft');
    if (raw === 'published' || raw === 'scheduled' || raw === 'unpublished') return raw as ContentRecord['status'];
    return 'draft' as const;
  })();

  return {
    id: str(row.id),
    slug: str(row.slug),
    title: str(row.title),
    description: str(row.summary ?? row.excerpt),
    body: str(row.content ?? row.syndicated_body),
    contentType,
    status,
    author: str(row.author ?? row.original_author, 'NexTake'),
    category: str(row.category, 'General'),
    tags,
    coverImage: str(row.cover_image_url ?? row.image) || undefined,
    videoUrl: row.video_url ? str(row.video_url) : undefined,
    publishedAt: row.published_at ? str(row.published_at) : undefined,
    createdAt: str(row.created_at, new Date().toISOString()),
    updatedAt: str(row.updated_at ?? row.created_at, new Date().toISOString()),
    featured: false,
    featuredPriority: 0,
  };
}

/** Returns true when SUPABASE_URL and SUPABASE_ANON_KEY are configured. */
export const isSupabaseEnabled = (): boolean =>
  Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);

/**
 * Fetches all published articles from Supabase.
 * Returns an empty array on any error so the caller can fall back gracefully.
 */
export async function getPublishedFromSupabase(): Promise<ContentRecord[]> {
  if (!isSupabaseEnabled()) return [];

  const url = new URL(`${config.SUPABASE_URL}/rest/v1/articles`);
  url.searchParams.set('select', COLUMNS);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('order', 'published_at.desc,created_at.desc');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `[supabase-content] Supabase returned ${response.status}: ${await response.text()}`,
      );
      return [];
    }

    const rows = (await response.json()) as ArticleRow[];
    if (!Array.isArray(rows)) return [];

    return rows.map(rowToContentRecord).filter(
      (record) => record.status === 'published',
    );
  } catch (error) {
    console.error('[supabase-content] Failed to fetch from Supabase:', error);
    return [];
  }
}

/**
 * Fetches a single published article by slug from Supabase.
 */
export async function getFromSupabaseBySlug(slug: string): Promise<ContentRecord | null> {
  if (!isSupabaseEnabled()) return null;

  const url = new URL(`${config.SUPABASE_URL}/rest/v1/articles`);
  url.searchParams.set('select', COLUMNS);
  url.searchParams.set('slug', `eq.${slug}`);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('limit', '1');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const rows = (await response.json()) as ArticleRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rowToContentRecord(rows[0]);
  } catch {
    return null;
  }
}

/** Fetches one published article by its database ID. */
export async function getFromSupabaseById(id: string): Promise<ContentRecord | null> {
  if (!isSupabaseEnabled()) return null;

  const url = new URL(`${config.SUPABASE_URL}/rest/v1/articles`);
  url.searchParams.set('select', COLUMNS);
  url.searchParams.set('id', `eq.${id}`);
  url.searchParams.set('status', 'eq.published');
  url.searchParams.set('limit', '1');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        apikey: config.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${config.SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const rows = (await response.json()) as ArticleRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rowToContentRecord(rows[0]);
  } catch {
    return null;
  }
}
