import test from 'node:test';
import assert from 'node:assert/strict';
import { rankRecommendations, scoreRecommendation } from './recommendations';

const articles = [
  { id: 'ai-new', title: 'AI systems', category: 'AI', keywords: ['ai', 'agents'], publishedAt: new Date().toISOString(), views: 10 },
  { id: 'security-old', title: 'Security systems', category: 'Cybersecurity', keywords: ['security'], publishedAt: '2020-01-01', views: 1000 },
  { id: 'network-new', title: 'Network systems', category: 'Networking', keywords: ['networking'], publishedAt: new Date().toISOString(), views: 2 },
];

test('topic similarity gives relevant articles a higher score', () => {
  assert.ok(scoreRecommendation(articles[0], { interests: ['AI'], readArticleIds: [], readKeywords: [] }, articles) > scoreRecommendation(articles[2], { interests: ['AI'], readArticleIds: [], readKeywords: [] }, articles));
});

test('ranking excludes already-read and shown articles', () => {
  const result = rankRecommendations(articles, { interests: [], readArticleIds: ['ai-new'], readKeywords: [], shownArticleIds: ['network-new'] });
  assert.deepEqual(result.map((entry) => entry.article.id), ['security-old']);
});

test('ranking returns exploration items and avoids duplicates', () => {
  const candidates = [
    ...articles,
    ...Array.from({ length: 7 }, (_, index) => ({
      id: `explore-${index}`,
      title: `Exploration ${index}`,
      category: `Category ${index}`,
      keywords: [`topic-${index}`],
      publishedAt: new Date().toISOString(),
      views: 1,
    })),
  ];
  const result = rankRecommendations(candidates, { interests: ['AI'], readArticleIds: [], readKeywords: [] }, 10);
  assert.equal(new Set(result.map((entry) => entry.article.id)).size, result.length);
  assert.ok(result.some((entry) => entry.source === 'exploration'));
});
