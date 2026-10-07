export type EmbeddedMediaKind = 'interview' | 'short';

export interface EmbeddedMediaRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  author: string;
  authorRole: string;
  guestName: string;
  guestRole: string;
  guestCompany: string;
  tags: string[];
  durationSeconds: number;
  publishedAt: string;
  kind: EmbeddedMediaKind;
}

const text = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;

const durationFrom = (value: unknown) => {
  const raw = Number(value);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
};

const mediaKind = (item: Record<string, unknown>, tags: string[]): EmbeddedMediaKind => {
  const value = [
    item.mediaType,
    item.media_type,
    item.contentType,
    item.content_type,
    item.section,
    item.format,
    ...tags,
  ].map((entry) => text(entry).toLowerCase()).join(' ');
  return /short|reel|60.?second/.test(value) ? 'short' : 'interview';
};

export const getPublishedEmbeddedMedia = async (): Promise<EmbeddedMediaRecord[]> => {
  try {
    const response = await fetch('/api/public/content');
    if (!response.ok) return [];
    const payload = await response.json() as { items?: unknown[] };
    const items = Array.isArray(payload.items) ? payload.items : [];

    return items.flatMap((entry, index) => {
      if (!entry || typeof entry !== 'object') return [];
      const item = entry as Record<string, unknown>;
      const videoUrl = text(item.videoUrl ?? item.video_url);
      if (!videoUrl) return [];

      const tags = Array.isArray(item.tags) ? item.tags.map((tag) => text(tag)).filter(Boolean) : text(item.tags).split(',').map((tag) => tag.trim()).filter(Boolean);
      const publishedAt = text(item.publishedAt ?? item.published_at ?? item.createdAt ?? item.created_at, new Date(0).toISOString());
      return [{
        id: `admin-media-${text(item.id, String(index))}`,
        title: text(item.title, 'Untitled video'),
        description: text(item.description ?? item.body),
        category: text(item.category, 'Technology'),
        videoUrl,
        thumbnail: text(item.coverImage ?? item.cover_image ?? item.coverImageUrl ?? item.cover_image_url),
        author: text(item.author, 'NexTake Editorial'),
        authorRole: 'NexTake Editorial',
        guestName: text(item.guestName ?? item.guest_name, text(item.author, 'NexTake Guest')),
        guestRole: text(item.guestRole ?? item.guest_role, 'Guest'),
        guestCompany: text(item.guestCompany ?? item.guest_company, 'NexTake'),
        tags,
        durationSeconds: durationFrom(item.durationSeconds ?? item.duration_seconds),
        publishedAt,
        kind: mediaKind(item, tags),
      } satisfies EmbeddedMediaRecord];
    }).sort((first, second) => new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime());
  } catch {
    return [];
  }
};
