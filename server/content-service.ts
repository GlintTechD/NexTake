import crypto from 'node:crypto';
import { pool } from './db';
import { ContentRecord, ContentStatus, ContentType, normalizeSlug } from './content';
import {
  getFromSupabaseById,
  getFromSupabaseBySlug,
  getPublishedFromSupabase,
  isSupabaseEnabled,
} from './supabase-content';

const contentTable = 'content';

type PgContentRow = Record<string, unknown>;

const str = (v: unknown, fallback = ''): string => (v == null ? fallback : String(v));

const boolVal = (v: unknown, fallback = false): boolean => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 't' || v === 'true' || v === '1';
  return Boolean(v);
};

const strArr = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return v.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const contentTypeFor = (raw: unknown): ContentRecord['contentType'] => {
  const v = str(raw, 'blog');
  if (v === 'media') return 'media';
  if (v === 'event') return 'event';
  if (v === 'news') return 'news';
  if (v === 'announcement') return 'announcement';
  if (v === 'project') return 'project';
  if (v === 'opportunity') return 'opportunity';
  return 'blog';
};

const statusFor = (raw: unknown): ContentRecord['status'] => {
  const v = str(raw, 'draft');
  if (v === 'published' || v === 'scheduled' || v === 'unpublished') return v;
  return 'draft';
};

const pgRowToContentRecord = (row: PgContentRow): ContentRecord => ({
  id: str(row.id),
  title: str(row.title),
  slug: str(row.slug),
  description: str(row.description),
  body: str(row.body),
  contentType: contentTypeFor(row.content_type ?? row.contentType),
  status: statusFor(row.status),
  author: str(row.author, 'NexTake'),
  category: str(row.category, 'General'),
  tags: strArr(row.tags),
  coverImage: str(row.cover_image ?? row.coverImage) || undefined,
  externalLink: str(row.external_link ?? row.externalLink) || undefined,
  videoUrl: str(row.video_url ?? row.videoUrl) || undefined,
  scheduledFor: row.scheduled_for ?? row.scheduledFor ? str(row.scheduled_for ?? row.scheduledFor) : undefined,
  publishedAt: row.published_at ?? row.publishedAt ? str(row.published_at ?? row.publishedAt) : undefined,
  createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
  updatedAt: str(row.updated_at ?? row.updatedAt ?? row.created_at ?? row.createdAt, new Date().toISOString()),
  featured: boolVal(row.featured, false),
  featuredPriority: Number(row.featured_priority ?? row.featuredPriority ?? 0),
});

const withUniqueSlug = async (baseSlug: string, ignoreId?: string) => {
  let slug = normalizeSlug(baseSlug || 'untitled');
  if (!slug) {
    slug = 'untitled';
  }

  let candidate = slug;
  let suffix = 2;

  while (true) {
    if (!pool) {
      return candidate;
    }

    const existing = await pool.query(
      `SELECT id FROM ${contentTable} WHERE slug = $1 AND id <> COALESCE($2, '00000000-0000-0000-0000-000000000000') LIMIT 1`,
      [candidate, ignoreId ?? null],
    );

    if (!existing.rows[0]) {
      return candidate;
    }

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
};

export const createContentRecord = async (input: Partial<ContentRecord> & Pick<ContentRecord, 'title' | 'description' | 'body'>) => {
  if (!pool) {
    return null;
  }

  const now = new Date().toISOString();
  const slug = await withUniqueSlug(String(input.slug ?? input.title ?? 'untitled'));
  const id = crypto.randomUUID();

  const result = await pool.query(
    `
      INSERT INTO ${contentTable} (
        id, title, slug, description, body, content_type, status, author, category, tags,
        cover_image, external_link, video_url, scheduled_for, published_at, created_at, updated_at,
        featured, featured_priority
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `,
    [
      id,
      input.title,
      slug,
      input.description,
      input.body,
      input.contentType ?? 'blog',
      input.status ?? 'draft',
      input.author ?? 'Glint',
      input.category ?? 'General',
      input.tags ?? [],
      input.coverImage ?? null,
      input.externalLink ?? null,
      input.videoUrl ?? null,
      input.scheduledFor ?? null,
      input.publishedAt ?? null,
      now,
      now,
      Boolean(input.featured),
      Number(input.featuredPriority ?? 0),
    ],
  );

  return pgRowToContentRecord(result.rows[0]);
};

export const getPublishedContent = async () => {
  if (isSupabaseEnabled()) {
    return getPublishedFromSupabase();
  }

  if (!pool) {
    return [] as ContentRecord[];
  }

  const result = await pool.query(
    `
      SELECT *
      FROM ${contentTable}
      WHERE status = 'published'
        AND (published_at IS NULL OR published_at <= NOW())
        AND (scheduled_for IS NULL OR scheduled_for <= NOW())
      ORDER BY published_at DESC NULLS LAST, created_at DESC
    `,
  );

  return result.rows.map(pgRowToContentRecord);
};

export const getContentBySlug = async (slug: string) => {
  if (isSupabaseEnabled()) {
    return getFromSupabaseBySlug(slug);
  }

  if (!pool) {
    return null;
  }

  const result = await pool.query(
    `
      SELECT * FROM ${contentTable}
      WHERE slug = $1
      LIMIT 1
    `,
    [slug],
  );

  return result.rows[0] ? pgRowToContentRecord(result.rows[0]) : null;
};

export const getContentById = async (id: string) => {
  if (isSupabaseEnabled()) {
    return getFromSupabaseById(id);
  }

  if (!pool) {
    return null;
  }

  const result = await pool.query(
    `SELECT * FROM ${contentTable} WHERE id = $1 LIMIT 1`,
    [id],
  );

  return result.rows[0] ? pgRowToContentRecord(result.rows[0]) : null;
};

export const listAdminContent = async () => {
  if (!pool) {
    return [] as ContentRecord[];
  }

  const result = await pool.query(
    `SELECT * FROM ${contentTable} ORDER BY updated_at DESC`,
  );

  return result.rows.map(pgRowToContentRecord);
};

export const updateContentRecord = async (id: string, input: Partial<ContentRecord>) => {
  if (!pool) {
    return null;
  }

  const current = await pool.query(`SELECT * FROM ${contentTable} WHERE id = $1`, [id]);
  if (!current.rows[0]) {
    return null;
  }

  const nextSlug = input.slug ? await withUniqueSlug(String(input.slug), id) : current.rows[0].slug;
  const nextStatus = input.status ?? current.rows[0].status;
  const nextPublishedAt = input.publishedAt ?? current.rows[0].published_at ?? null;

  const result = await pool.query(
    `
      UPDATE ${contentTable}
      SET title = $2,
          slug = $3,
          description = $4,
          body = $5,
          content_type = $6,
          status = $7,
          author = $8,
          category = $9,
          tags = $10,
          cover_image = $11,
          external_link = $12,
          video_url = $13,
          scheduled_for = $14,
          published_at = $15,
          featured = $16,
          featured_priority = $17,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [
      id,
      input.title ?? current.rows[0].title,
      nextSlug,
      input.description ?? current.rows[0].description,
      input.body ?? current.rows[0].body,
      input.contentType ?? current.rows[0].content_type,
      nextStatus,
      input.author ?? current.rows[0].author,
      input.category ?? current.rows[0].category,
      input.tags ?? current.rows[0].tags,
      input.coverImage ?? current.rows[0].cover_image,
      input.externalLink ?? current.rows[0].external_link,
      input.videoUrl ?? current.rows[0].video_url,
      input.scheduledFor ?? current.rows[0].scheduled_for,
      nextPublishedAt,
      Boolean(input.featured ?? current.rows[0].featured),
      Number(input.featuredPriority ?? current.rows[0].featured_priority ?? 0),
    ],
  );

  return pgRowToContentRecord(result.rows[0]);
};

export const deleteContentRecord = async (id: string) => {
  if (!pool) {
    return false;
  }

  const result = await pool.query(`DELETE FROM ${contentTable} WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
};

export const createOrUpdatePublicContent = async (items: ContentRecord[]) => {
  if (!pool) {
    return [] as ContentRecord[];
  }

  for (const item of items) {
    const existing = await getContentBySlug(item.slug);
    if (existing) {
      await updateContentRecord(existing.id, item);
    } else {
      await createContentRecord(item);
    }
  }

  return await getPublishedContent();
};
