import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNewsletterContentTypes, selectDigestContent, escapeHtml } from './newsletter';
import type { ContentRecord } from './content';

const createContent = (
  overrides: Partial<ContentRecord> = {},
): ContentRecord => ({
  id: 'story-1',
  title: 'A new story',
  slug: 'a-new-story',
  description: 'Story summary',
  body: 'Story body',
  contentType: 'news',
  status: 'published',
  author: 'Editor',
  category: 'Technology',
  tags: [],
  createdAt: '2026-10-18T08:00:00.000Z',
  updatedAt: '2026-10-18T08:00:00.000Z',
  publishedAt: '2026-10-18T08:00:00.000Z',
  ...overrides,
});

test('defaults legacy newsletter signups to every publishing type', () => {
  assert.deepEqual(normalizeNewsletterContentTypes(undefined), [
    'blog',
    'news',
    'announcement',
    'project',
    'event',
    'media',
    'opportunity',
  ]);
});

test('validates and deduplicates selected newsletter types', () => {
  assert.deepEqual(normalizeNewsletterContentTypes(['news', 'event', 'news']), ['news', 'event']);
  assert.equal(normalizeNewsletterContentTypes([]), null);
  assert.equal(normalizeNewsletterContentTypes(['news', 'unknown']), null);
  assert.equal(normalizeNewsletterContentTypes('news'), null);
});

test('selects only published content matching selected types in the digest window', () => {
  const since = new Date('2026-10-18T00:00:00.000Z');
  const until = new Date('2026-10-19T00:00:00.000Z');
  const items = [
    createContent({ id: 'news', contentType: 'news', publishedAt: '2026-10-18T08:00:00.000Z' }),
    createContent({ id: 'event', contentType: 'event', publishedAt: '2026-10-18T12:00:00.000Z' }),
    createContent({ id: 'draft', status: 'draft', publishedAt: '2026-10-18T10:00:00.000Z' }),
    createContent({ id: 'old', publishedAt: '2026-10-17T23:59:00.000Z' }),
  ];

  assert.deepEqual(
    selectDigestContent(items, ['news'], since, until).map((item) => item.id),
    ['news'],
  );
});

test('escapes user-provided text before inserting it into email HTML', () => {
  assert.equal(escapeHtml(`<script a="b">&'`), '&lt;script a=&quot;b&quot;&gt;&amp;&#39;');
});
