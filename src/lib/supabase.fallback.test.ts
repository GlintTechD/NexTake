import test from 'node:test';
import assert from 'node:assert/strict';

import { getArticleById } from './supabase';

test('falls back to built-in article data for standard dispatch routes when Supabase is unavailable', async () => {
  const article = await getArticleById('dispatch-fintech-rails');

  assert.ok(article, 'expected a built-in article fallback');
  assert.equal(article?.id, 'dispatch-fintech-rails');
  assert.match(article?.title ?? '', /African Fintech/i);
});
