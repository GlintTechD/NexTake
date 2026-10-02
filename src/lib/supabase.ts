import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { FEATURED_ARTICLE, ALL_HERO_ARTICLES, type Article as MockArticle } from "../data/mockData";

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
}

export async function getDailyEditItems(): Promise<DailyEditItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("daily_tips")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error loading Daily Editorial:", error);
    return [];
  }

  return (data ?? []).map((tip, index) => {
    const wordCount = (tip.content ?? "").trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    return {
      id: tip.id,
      num: String(index + 1).padStart(2, "0"),
      tag: tip.category ?? "General",
      timeAgo: formatTimeAgo(tip.published_at ?? tip.created_at),
      readTime,
      title: tip.title ?? "",
      description: tip.content ?? "",
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

export async function getArticleById(id: string): Promise<Article | null> {
  if (!id) return null;

  const localArticle = ALL_HERO_ARTICLES[id] ?? (id === FEATURED_ARTICLE.id ? FEATURED_ARTICLE : null);
  if (localArticle) {
    return buildMockArticle(localArticle);
  }

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error loading article by ID:", error);
    return null;
  }

  if (!data) return null;

  return {
    ...(data as Article),
    published_at: (data as Article).published_at ?? (data as Article).created_at ?? (data as Article).date ?? null,
    created_at: (data as Article).created_at ?? (data as Article).published_at ?? (data as Article).date ?? null,
  } as Article;
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