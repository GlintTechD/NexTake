export interface RecommendationArticle {
  id: string;
  title: string;
  keywords?: string[];
  category?: string;
  publishedAt?: string;
  views?: number;
  recentViews?: number;
  readingSeconds?: number;
  engagementCount?: number;
}

export interface RecommendationContext {
  interests: string[];
  readArticleIds: string[];
  readKeywords: string[];
  shownArticleIds?: string[];
}

export interface RecommendationWeights {
  topic: number;
  recency: number;
  popularity: number;
}

export const DEFAULT_RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  topic: 0.5,
  recency: 0.3,
  popularity: 0.2,
};

const normalize = (value: string) => value.toLowerCase().trim();

const topicSimilarity = (article: RecommendationArticle, context: RecommendationContext) => {
  const articleTopics = new Set((article.keywords ?? []).map(normalize));
  if (article.category) articleTopics.add(normalize(article.category));
  const preferredTopics = new Set([...context.interests, ...context.readKeywords].map(normalize));
  if (!articleTopics.size || !preferredTopics.size) return 0;
  const overlap = [...articleTopics].filter((topic) => preferredTopics.has(topic)).length;
  return Math.min(1, overlap / Math.max(1, Math.min(articleTopics.size, preferredTopics.size)));
};

const recencyScore = (publishedAt?: string, now = Date.now()) => {
  if (!publishedAt) return 0.25;
  const ageDays = Math.max(0, (now - new Date(publishedAt).getTime()) / 86_400_000);
  return Math.exp(-ageDays / 14);
};

const popularityScore = (article: RecommendationArticle, maxPopularity: number) => {
  const raw = (article.views ?? 0) * 0.5 + (article.recentViews ?? 0) * 0.3 + Math.min(article.readingSeconds ?? 0, 1800) * 0.1 + (article.engagementCount ?? 0) * 0.1;
  return maxPopularity > 0 ? Math.min(1, raw / maxPopularity) : 0;
};

export const scoreRecommendation = (
  article: RecommendationArticle,
  context: RecommendationContext,
  articles: RecommendationArticle[],
  weights = DEFAULT_RECOMMENDATION_WEIGHTS,
  now = Date.now(),
) => {
  const popularities = articles.map((candidate) => (candidate.views ?? 0) * 0.5 + (candidate.recentViews ?? 0) * 0.3 + Math.min(candidate.readingSeconds ?? 0, 1800) * 0.1 + (candidate.engagementCount ?? 0) * 0.1);
  const maxPopularity = Math.max(1, ...popularities);
  return topicSimilarity(article, context) * weights.topic
    + recencyScore(article.publishedAt, now) * weights.recency
    + popularityScore(article, maxPopularity) * weights.popularity;
};

export const rankRecommendations = (
  articles: RecommendationArticle[],
  context: RecommendationContext,
  limit = 10,
  weights = DEFAULT_RECOMMENDATION_WEIGHTS,
  now = Date.now(),
) => {
  const shown = new Set(context.shownArticleIds ?? []);
  const unread = articles.filter((article) => !context.readArticleIds.includes(article.id) && !shown.has(article.id));
  const scored = unread.map((article) => ({
    article,
    score: scoreRecommendation(article, context, articles, weights, now),
  })).sort((left, right) => right.score - left.score);

  const personalizedCount = Math.min(6, Math.ceil(limit * 0.6));
  const personalized = scored.filter(({ article }) => scoreRecommendation(article, context, articles, weights, now) > weights.recency * 0.5).slice(0, personalizedCount);
  const selected = [...personalized];
  const selectedTopics = new Set(personalized.map(({ article }) => normalize(article.category ?? article.keywords?.[0] ?? '')));

  for (const candidate of scored) {
    if (selected.length >= limit) break;
    if (selected.some(({ article }) => article.id === candidate.article.id)) continue;
    const topic = normalize(candidate.article.category ?? candidate.article.keywords?.[0] ?? '');
    if (selectedTopics.has(topic) && selected.length < personalizedCount) continue;
    selected.push(candidate);
    selectedTopics.add(topic);
  }

  return selected.slice(0, limit).map(({ article, score }, index) => ({
    article,
    score,
    source: index < personalizedCount ? 'personalized' as const : 'exploration' as const,
  }));
};
