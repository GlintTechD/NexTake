import { formatTimeAgo, supabase } from './supabase';

export type LatestSource = 'portal' | 'article' | 'daily-edit';

export interface LatestStory {
  id: string;
  slug?: string;
  title: string;
  category: string;
  description: string;
  content: string;
  author: string;
  image: string;
  videoUrl?: string;
  publishedAt: string | null;
  timeAgo: string;
  readTime: string;
  contentType: string;
  sourceLabel: string;
  tags: string[];
}

type ContentRecord = Record<string, unknown>;

const asRecord = (value: unknown): ContentRecord | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as ContentRecord)
    : null;

const firstValue = (record: ContentRecord, ...keys: string[]): unknown => {
  for (const key of keys) {
    const value = record[key];
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return undefined;
};

const asText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();

const asDateString = (value: unknown): string | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  const text = asText(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const getReadTime = (value: unknown, content: string): string => {
  const supplied = asText(value);
  if (supplied) return supplied;

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const isFutureDate = (value: string | null): boolean =>
  Boolean(value && new Date(value).getTime() > Date.now());

const titleCase = (value: string): string =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

/**
 * Convert a published record from one of the public editorial sources into the
 * single shape used by the Latest feed. The posting portal is intentionally
 * limited to article-like types; events and other non-article content do not
 * belong in this feed.
 */
export const normalizeLatestStory = (
  value: unknown,
  source: LatestSource,
): LatestStory | null => {
  const record = asRecord(value);
  if (!record) return null;

  const status = asText(record.status).toLowerCase();
  if (status && status !== 'published') return null;

  const rawType = asText(firstValue(record, 'contentType', 'content_type', 'type'));
  const normalizedType = rawType.toLowerCase().replace(/[\s_-]+/g, '-');
  if (source === 'portal' && !['article', 'blog', 'news', 'announcement', 'media', 'daily-edit', 'big-story', 'latest'].includes(normalizedType)) {
    return null;
  }

  const id = asText(firstValue(record, 'id', 'slug'));
  const title = asText(record.title);
  if (!id || !title) return null;

  const body = asText(firstValue(record, 'body', 'content', 'description', 'excerpt'));
  const description = asText(firstValue(record, 'excerpt', 'description', 'summary', 'content', 'body'));
  const publishedAt = asDateString(firstValue(
    record,
    'publishedAt',
    'published_at',
    'createdAt',
    'created_at',
    'date',
    'updatedAt',
    'updated_at',
  ));
  if (isFutureDate(publishedAt)) return null;

  const tagsValue = record.tags;
  const tags = Array.isArray(tagsValue)
    ? tagsValue.map(asText).filter(Boolean)
    : typeof tagsValue === 'string'
      ? tagsValue.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const fallbackType = source === 'daily-edit' ? 'daily-edit' : source === 'portal' ? 'blog' : 'article';
  const contentType = normalizedType || fallbackType;
  const sourceLabel = source === 'daily-edit'
    ? 'Daily Edit'
    : source === 'portal' || ['daily-edit', 'big-story', 'latest'].includes(normalizedType)
      ? titleCase(contentType)
      : 'Article';

  return {
    id,
    slug: asText(record.slug) || undefined,
    title,
    category: asText(record.category),
    description,
    content: body,
    author: asText(record.author),
    image: asText(firstValue(record, 'image', 'imageUrl', 'image_url', 'coverImage', 'coverImageUrl', 'cover_image', 'cover_image_url', 'featured_image')),
    videoUrl: asText(firstValue(record, 'videoUrl', 'video_url')) || undefined,
    publishedAt,
    timeAgo: publishedAt ? formatTimeAgo(publishedAt) : 'Recently published',
    readTime: getReadTime(firstValue(record, 'readTime', 'read_time'), body || description),
    contentType,
    sourceLabel,
    tags,
  };
};

export const mergeLatestStories = (stories: LatestStory[]): LatestStory[] => {
  const uniqueStories = new Map<string, LatestStory>();

  for (const story of stories) {
    if (!uniqueStories.has(story.id)) uniqueStories.set(story.id, story);
  }

  return Array.from(uniqueStories.values()).sort((first, second) => {
    const firstDate = first.publishedAt ? new Date(first.publishedAt).getTime() : 0;
    const secondDate = second.publishedAt ? new Date(second.publishedAt).getTime() : 0;
    return secondDate - firstDate;
  });
};

const fetchPortalContent = async (): Promise<unknown[]> => {
  const response = await fetch('/api/public/content');
  if (!response.ok) throw new Error(`Published content request failed (${response.status}).`);

  const payload = await response.json() as { items?: unknown[] };
  return Array.isArray(payload.items) ? payload.items : [];
};

const fetchSupabaseRows = async (
  table: 'articles' | 'daily_tips',
  orderColumn: 'created_at' | 'published_at',
): Promise<unknown[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('status', 'published')
    .order(orderColumn, { ascending: false });

  if (error) throw error;
  return data ?? [];
};

/** Load every published article/blog source, with no six-item cap or mock data. */
export const getLatestPublishedStories = async (): Promise<LatestStory[]> => {
  const sources: Array<{ name: string; source: LatestSource; load: () => Promise<unknown[]> }> = [
    { name: 'posting portal', source: 'portal', load: fetchPortalContent },
  ];

  if (supabase) {
    sources.push(
      { name: 'articles', source: 'article', load: () => fetchSupabaseRows('articles', 'created_at') },
      { name: 'Daily Edit', source: 'daily-edit', load: () => fetchSupabaseRows('daily_tips', 'published_at') },
    );
  }

  const results = await Promise.allSettled(sources.map((source) => source.load()));
  let successfulSources = 0;
  const stories: LatestStory[] = [];

  results.forEach((result, index) => {
    const source = sources[index];
    if (result.status === 'rejected') {
      console.error(`Unable to load published ${source.name}:`, result.reason);
      return;
    }

    successfulSources += 1;
    for (const row of result.value) {
      const story = normalizeLatestStory(row, source.source);
      if (story) stories.push(story);
    }
  });

  if (successfulSources === 0) {
    throw new Error('Unable to reach any published content source.');
  }

  return mergeLatestStories(stories);
};
