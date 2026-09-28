export const contentTypeMap = ['blog', 'news', 'announcement', 'project', 'event', 'media', 'opportunity'] as const;

export type ContentType = (typeof contentTypeMap)[number];

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'unpublished';

export interface ContentRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  contentType: ContentType;
  status: ContentStatus;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  externalLink?: string;
  videoUrl?: string;
  scheduledFor?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  featuredPriority?: number;
}

export const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'untitled';

export const isPubliclyVisible = (status: ContentStatus, scheduledFor?: string, publishedAt?: string) => {
  if (status !== 'published') return false;
  if (scheduledFor && new Date(scheduledFor).getTime() > Date.now()) return false;
  if (publishedAt && new Date(publishedAt).getTime() > Date.now()) return false;
  return true;
};
