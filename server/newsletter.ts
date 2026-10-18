import { contentTypeMap, type ContentRecord, type ContentType } from './content';

export const newsletterContentTypes = contentTypeMap;
export type NewsletterContentType = ContentType;

const isNewsletterContentType = (value: unknown): value is NewsletterContentType =>
  typeof value === 'string' &&
  (newsletterContentTypes as readonly string[]).includes(value);

export const normalizeNewsletterContentTypes = (
  value: unknown,
): NewsletterContentType[] | null => {
  if (value === undefined || value === null) {
    return [...newsletterContentTypes];
  }
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const types = value.filter(isNewsletterContentType);
  if (types.length !== value.length) {
    return null;
  }

  return [...new Set(types)];
};

export const selectDigestContent = (
  content: ContentRecord[],
  contentTypes: NewsletterContentType[],
  since: Date,
  until: Date,
): ContentRecord[] => {
  const selectedTypes = new Set(contentTypes);

  return content
    .filter((item) => {
      if (item.status !== 'published' || !selectedTypes.has(item.contentType)) {
        return false;
      }

      const publishedAt = new Date(item.publishedAt ?? item.createdAt).getTime();
      return Number.isFinite(publishedAt) && publishedAt > since.getTime() && publishedAt <= until.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    );
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
