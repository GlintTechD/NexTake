import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { FEATURED_ARTICLE, ALL_HERO_ARTICLES } from "../data/mockData";
import type { Article as MockArticle } from "../types";

const runtimeEnv =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : ({} as Record<string, string | undefined>);

const supabaseUrl = (runtimeEnv.VITE_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (runtimeEnv.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// --------------------------------------
// Article Types
// --------------------------------------

export interface Article {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  description?: string;
  content?: string;
  author?: string;
  avatar?: string;
  image?: string;
  videoUrl?: string;
  date?: string;
  readTime?: string;
  read_time?: string;
  type?: string;
  topic?: string;
  status?: string;
  created_at?: string;
  published_at?: string;
  heroAperture?: string;
  hero_priority?: number | null;
  body?: string;
  content_type?: string;
  contentType?: string;
  cover_image?: string;
  cover_image_url?: string;
  coverImage?: string;
  coverImageUrl?: string;
  image_url?: string;
  imageUrl?: string;
  featured_image?: string;
  publishedAt?: string;
  createdAt?: string;
  slug?: string;
  tags?: string[];
}

// --------------------------------------
// Daily Editorial
// --------------------------------------

export interface DailyEditItem {
  id: string;
  num: string;
  tag: string;
  timeAgo: string;
  readTime: string;
  title: string;
  description: string;
  image?: string;
}

export async function getDailyEditItems(): Promise<DailyEditItem[]> {
  let data: any[] = [];
  if (supabase) {
    const result = await supabase
      .from("daily_tips")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5);
    if (result.error) console.error("Error loading Daily Editorial:", result.error);
    data = result.data ?? [];
  }

  if (data.length === 0) {
    try {
      const response = await fetch('/api/public/content');
      if (response.ok) {
        const payload = await response.json() as { items?: any[] };
        data = (payload.items ?? [])
          .filter((item) => ['daily-edit', 'blog', 'news', 'media'].includes(String(item.contentType ?? item.content_type ?? '').toLowerCase()))
          .sort((a, b) => new Date(b.publishedAt ?? b.published_at ?? b.createdAt ?? b.created_at ?? 0).getTime() - new Date(a.publishedAt ?? a.published_at ?? a.createdAt ?? a.created_at ?? 0).getTime())
          .slice(0, 5);
      }
    } catch {
      data = [];
    }
  }

  return data.map((tip, index) => {
    const wordCount = (tip.content ?? "").trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    return {
      id: String(tip.id ?? tip.slug ?? index),
      num: String(index + 1).padStart(2, "0"),
      tag: tip.category ?? "General",
      timeAgo: formatTimeAgo(tip.published_at ?? tip.publishedAt ?? tip.created_at ?? tip.createdAt),
      readTime,
      title: tip.title ?? "",
      description: tip.content ?? tip.body ?? tip.excerpt ?? tip.description ?? "",
      image: tip.image || tip.imageUrl || tip.image_url || tip.coverImage || tip.coverImageUrl || tip.cover_image || tip.cover_image_url || tip.featured_image || "",
    };
  });
}

// --------------------------------------
// Time Formatting
// --------------------------------------

export function formatTimeAgo(dateString?: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const difference = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (difference < 60) {
    return "just now";
  }

  const minutes = Math.floor(difference / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// --------------------------------------
// Daily Edit Settings
// --------------------------------------

export interface DailyEditSettings {
  id?: string;

  eyebrow: string | null;
  title: string | null;
  description: string | null;
  subscriber_text: string | null;

  morning_name: string | null;
  morning_description: string | null;

  telemetry_name: string | null;
  telemetry_description: string | null;

  monographs_name: string | null;
  monographs_description: string | null;

  email_label: string | null;
  email_placeholder: string | null;
  button_text: string | null;

  privacy_text: string | null;
  unsubscribe_text: string | null;
}

export async function getDailyEditSettings(): Promise<DailyEditSettings | null> {
  const dailyEditEnabled = (runtimeEnv.VITE_ENABLE_DAILY_EDIT_SETTINGS ?? "").trim() === "true";
  if (!supabase || !dailyEditEnabled) return null;

  const { data, error } = await supabase
    .from("daily_edit_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") return null;
    console.error("Error loading Daily Edit settings:", error);
    return null;
  }

  return data;
}

// --------------------------------------
// Latest Articles
// --------------------------------------

export interface LatestArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  timeAgo: string;
  readTime: string;
  type: string;
  topic: string;
  created_at: string;
}

export async function getLatestArticles(): Promise<LatestArticle[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading latest articles:", error);
    return [];
  }

  return (data ?? []).map((article) => ({
    id: article.id,
    title: article.title ?? "",
    category: article.category ?? "General",
    description: article.excerpt ?? article.description ?? "",
    image: article.image || article.imageUrl || article.image_url || article.coverImage || article.coverImageUrl || article.cover_image || article.cover_image_url || article.featured_image || "",
    timeAgo: formatTimeAgo(article.created_at),
    readTime: article.read_time ?? article.readTime ?? "3 min read",
    type: article.type ?? "Dispatches",
    topic: article.topic ?? article.category ?? "General",
    created_at: article.created_at,
  }));
}

// --------------------------------------
// Single Article
// --------------------------------------

const buildMockArticle = (article: MockArticle): Article => ({
  id: article.id,
  title: article.title,
  category: article.category,
  excerpt: article.subtitle,
  content: article.contentSections
    ?.flatMap((section) => section.paragraphs ?? [])
    .join("\n\n"),
  author: article.author?.name,
  avatar: article.author?.avatar,
  image: article.heroImage,
  date: article.date,
  readTime: article.readTime,
  status: "published",
  published_at: new Date(article.date ?? Date.now()).toISOString(),
  heroAperture: article.heroAperture,
});

export const resolvePublishedAt = (article: Partial<Article> | null | undefined) => article?.published_at ?? article?.created_at ?? article?.date ?? null;

const buildDailyTipArticle = (tip: Record<string, any>): Article => {
  const content = tip?.content ?? tip?.excerpt ?? "";
  const wordCount = (content ?? "").trim().split(/\s+/).filter(Boolean).length;

  return {
    id: String(tip?.id ?? ""),
    title: tip?.title ?? "Untitled story",
    category: tip?.category ?? "General",
    excerpt: content,
    content,
    author: tip?.author ?? "NexTake Desk",
    avatar: tip?.avatar ?? "",
    image: tip?.image || tip?.imageUrl || tip?.image_url || tip?.coverImage || tip?.coverImageUrl || tip?.cover_image || tip?.cover_image_url || tip?.featured_image || "",
    date: tip?.published_at ?? tip?.created_at ?? null,
    readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
    read_time: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
    status: tip?.status ?? "published",
    created_at: tip?.created_at ?? null,
    published_at: tip?.published_at ?? tip?.created_at ?? null,
  };
};

const buildPostedContentArticle = (record: Record<string, any>): Article => {
  const content = record.body ?? record.content ?? "";
  const excerpt = record.description ?? record.excerpt ?? "";
  const wordCount = String(content || excerpt).trim().split(/\s+/).filter(Boolean).length;
  const readTime = record.readTime ?? record.read_time ?? `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
  const publishedAt = record.publishedAt ?? record.published_at ?? record.createdAt ?? record.created_at ?? null;

  return {
    id: String(record.id ?? record.slug ?? ""),
    title: record.title ?? "Untitled story",
    category: record.category ?? "General",
    excerpt,
    description: excerpt,
    content,
    author: record.author ?? "",
    image: record.image || record.imageUrl || record.image_url || record.coverImage || record.coverImageUrl || record.cover_image || record.cover_image_url || record.featured_image || "",
    videoUrl: record.videoUrl || record.video_url || "",
    date: publishedAt,
    created_at: record.createdAt ?? record.created_at ?? publishedAt,
    published_at: publishedAt,
    readTime,
    read_time: readTime,
    type: record.contentType ?? record.content_type ?? "blog",
    topic: record.category ?? "",
    status: record.status ?? "published",
    content_type: record.contentType ?? record.content_type ?? "blog",
    cover_image: record.coverImage ?? record.cover_image ?? record.cover_image_url ?? "",
    slug: record.slug,
    tags: Array.isArray(record.tags) ? record.tags : [],
  };
};

const getPostedContentArticle = async (id: string): Promise<Article | null> => {
  if (typeof fetch !== "function") return null;

  try {
    const response = await fetch(`/api/public/content/${encodeURIComponent(id)}`);
    if (!response.ok) return null;

    const payload = await response.json();
    if (!payload?.item) return null;

    return buildPostedContentArticle(payload.item as Record<string, any>);
  } catch {
    return null;
  }
};

export async function getArticleById(id: string): Promise<Article | null> {
  if (!id) return null;

  const localArticle = ALL_HERO_ARTICLES[id] ?? (id === FEATURED_ARTICLE.id ? FEATURED_ARTICLE : null);
  if (localArticle) {
    return buildMockArticle(localArticle);
  }

  if (supabase) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let articleQuery = supabase.from("articles").select("*").eq("status", "published");
    articleQuery = isUuid ? articleQuery.eq("id", id) : articleQuery.eq("slug", id);

    const { data: articleData, error: articleError } = await articleQuery.maybeSingle();

    if (articleError) {
      console.error("Error loading article by ID:", articleError);
    }

    if (articleData) {
      const raw = articleData as Record<string, any>;
      const resolvedContent =
        raw.content ||
        raw.body ||
        raw.syndicated_body ||
        raw.summary ||
        raw.excerpt ||
        raw.description ||
        "";
      const resolvedExcerpt =
        raw.excerpt ||
        raw.summary ||
        raw.description ||
        resolvedContent.slice(0, 200);

      return {
        ...(raw as Article),
        content: resolvedContent,
        excerpt: resolvedExcerpt,
        description: resolvedExcerpt,
        image:
          raw.image ||
          raw.imageUrl ||
          raw.image_url ||
          raw.coverImage ||
          raw.coverImageUrl ||
          raw.cover_image ||
          raw.cover_image_url ||
          raw.featured_image ||
          "",
        published_at: raw.published_at ?? raw.created_at ?? raw.date ?? null,
        created_at: raw.created_at ?? raw.published_at ?? raw.date ?? null,
      } as Article;
    }

    const { data: dailyTipData, error: dailyTipError } = await supabase
      .from("daily_tips")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();

    if (dailyTipError) {
      console.error("Error loading Daily Edit story by ID:", dailyTipError);
    }

    if (dailyTipData) {
      return buildDailyTipArticle(dailyTipData as Record<string, any>);
    }
  }

  return getPostedContentArticle(id);
}

export async function getPublishedBigStories(): Promise<Article[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading Big Stories:", error);
    return [];
  }

  return (data ?? []) as Article[];
}
