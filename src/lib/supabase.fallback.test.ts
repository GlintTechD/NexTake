import test from 'node:test';
import assert from 'node:assert/strict';

import { getArticleById, resolvePublishedAt } from './supabase';

test('falls back to built-in article data for standard dispatch routes when Supabase is unavailable', async () => {
  const article = await getArticleById('dispatch-fintech-rails');

  assert.ok(article, 'expected a built-in article fallback');
  assert.equal(article?.id, 'dispatch-fintech-rails');
  assert.match(article?.title ?? '', /African Fintech/i);
});

test('prefers the publication timestamp when a content record has both created and published dates', () => {
  const resolved = resolvePublishedAt({
    created_at: '2025-10-01T00:00:00.000Z',
    published_at: '2025-10-02T12:00:00.000Z',
  });

  assert.equal(resolved, '2025-10-02T12:00:00.000Z');
});
