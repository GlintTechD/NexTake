import type { Article } from "../types";
import { FEATURED_ARTICLE } from "../data/mockData";

type PublishedRecord = {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  avatar?: string;
  image?: string;
  read_time?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  keywords?: string[];
};

export const adaptPublishedArticle = (record: PublishedRecord): Article => ({
  ...FEATURED_ARTICLE,
  id: record.id,
  title: record.title || FEATURED_ARTICLE.title,
  subtitle: record.excerpt || FEATURED_ARTICLE.subtitle,
  category: record.category || FEATURED_ARTICLE.category,
  dispatchTag: record.keywords?.[0] || FEATURED_ARTICLE.dispatchTag,
  readTime: record.read_time || FEATURED_ARTICLE.readTime,
  date: record.date || (record.created_at ? new Date(record.created_at).toLocaleDateString() : FEATURED_ARTICLE.date),
  updatedAgo: record.updated_at ? new Date(record.updated_at).toLocaleDateString() : FEATURED_ARTICLE.updatedAgo,
  heroImage: record.image || FEATURED_ARTICLE.heroImage,
  author: {
    ...FEATURED_ARTICLE.author,
    name: record.author || FEATURED_ARTICLE.author.name,
    avatar: record.avatar || FEATURED_ARTICLE.author.avatar,
  },
  contentSections: record.content
    ? [{ heading: "Full article", paragraphs: record.content.split(/\n{2,}/).filter(Boolean) }]
    : FEATURED_ARTICLE.contentSections,
});
