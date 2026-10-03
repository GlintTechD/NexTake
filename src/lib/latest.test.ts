import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeLatestStories, normalizeLatestStory } from './latest';

test('normalizes published blog records from the posting portal', () => {
  const story = normalizeLatestStory({
    id: 'blog-1',
    title: 'A published blog',
    description: 'A short summary',
    body: 'Words in the blog body.',
    contentType: 'blog',
    status: 'published',
    createdAt: '2026-10-01T12:00:00.000Z',
    coverImage: '/blog-cover.jpg',
  }, 'portal');

  assert.ok(story);
  assert.equal(story.id, 'blog-1');
  assert.equal(story.sourceLabel, 'Blog');
  assert.equal(story.description, 'A short summary');
  assert.equal(story.image, '/blog-cover.jpg');
});

test('preserves admin-provided cover images from the article and Daily Edit sources', () => {
  const blog = normalizeLatestStory({
    id: 'image-blog',
    title: 'Blog with a cover',
    content_type: 'news',
    status: 'published',
    cover_image: '/uploads/blog-cover.jpg',
  }, 'portal');
  const dailyEdit = normalizeLatestStory({
    id: 'image-daily-edit',
    title: 'Daily Edit with a cover',
    status: 'published',
    image_url: '/uploads/daily-cover.jpg',
  }, 'daily-edit');

  assert.equal(blog?.image, '/uploads/blog-cover.jpg');
  assert.equal(dailyEdit?.image, '/uploads/daily-cover.jpg');
});

test('does not put drafts or non-article portal content in the Latest feed', () => {
  assert.equal(normalizeLatestStory({
    id: 'draft-1',
    title: 'Draft',
    contentType: 'blog',
    status: 'draft',
  }, 'portal'), null);

  assert.equal(normalizeLatestStory({
    id: 'event-1',
    title: 'An event',
    contentType: 'event',
    status: 'published',
  }, 'portal'), null);
});

test('merges sources without duplicate IDs and orders by publication date', () => {
  const older = normalizeLatestStory({
    id: 'older',
    title: 'Older article',
    status: 'published',
    created_at: '2026-09-01T00:00:00.000Z',
  }, 'article')!;
  const newer = normalizeLatestStory({
    id: 'newer',
    title: 'Newer Daily Edit',
    status: 'published',
    published_at: '2026-10-01T00:00:00.000Z',
  }, 'daily-edit')!;
  const duplicate = normalizeLatestStory({
    id: 'newer',
    title: 'Duplicate record',
    status: 'published',
    published_at: '2026-10-01T00:00:00.000Z',
  }, 'article')!;

  const stories = mergeLatestStories([older, newer, duplicate]);
  assert.equal(stories.length, 2);
  assert.deepEqual(stories.map((story) => story.id), ['newer', 'older']);
  assert.equal(stories[0].title, 'Newer Daily Edit');
});
