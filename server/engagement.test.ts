import test from 'node:test';
import assert from 'node:assert/strict';

import { getLatestCommentsPage } from './engagement';

test('returns the latest five comments first when paginating', () => {
  const comments = ['oldest', 'older', 'mid', 'newer', 'newest', 'later', 'latest'];

  assert.deepEqual(getLatestCommentsPage(comments, 1, 5), [
    'latest',
    'later',
    'newest',
    'newer',
    'mid',
  ]);

  assert.deepEqual(getLatestCommentsPage(comments, 2, 5), ['older', 'oldest']);
});
