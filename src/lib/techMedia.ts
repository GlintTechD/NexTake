import type { InterviewItem } from "../data/interviewData";
import { ALL_INTERVIEWS } from "../data/interviewData";
import { SHORTS_LIST } from "../data/mockData";
import type { ShortItem } from "../types";
import { supabase } from "./supabase";

export interface PublishedTechMedia {
  id: string;
  source_id: string | null;
  media_type: "video" | "interview";
  title: string;
  description: string;
  category: string;
  video_path: string;
  video_url: string;
  thumbnail_url: string;
  host_name: string;
  guest_name: string;
  guest_role: string;
  guest_company: string;
  duration_seconds: number;
  tags: string[];
  published_at: string;
}

export async function getPublishedTechMedia(): Promise<PublishedTechMedia[]> {
  if (!supabase) return [];

  const [mediaResult, articleResult] = await Promise.all([
    supabase
      .from("tech_media")
      .select("id, source_id, media_type, title, description, category, video_path, thumbnail_url, host_name, guest_name, guest_role, guest_company, duration_seconds, tags, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase
      .from("articles")
      .select("id, title, excerpt, summary, category, video_url, image, cover_image_url, author, tags, published_at, created_at, content_type, type, status")
      .eq("status", "published")
      .eq("content_type", "media")
      .not("video_url", "is", null)
      .order("published_at", { ascending: false }),
  ]);

  if (mediaResult.error && mediaResult.error.code !== "42P01" && mediaResult.error.code !== "PGRST205") {
    console.error("Unable to load uploaded Tech media:", mediaResult.error);
  }
  if (articleResult.error) {
    console.error("Unable to load published CMS videos:", articleResult.error);
  }

  const uploadedMedia = await Promise.all((mediaResult.data ?? []).map(async (record) => {
    const { data: signedVideo, error: storageError } = await supabase.storage
      .from("nextake-tech-media")
      .createSignedUrl(String(record.video_path), 60 * 60);
    if (storageError) {
      console.error(`Unable to load video ${record.id}:`, storageError);
      return null;
    }
    return { ...record, video_url: signedVideo.signedUrl } as PublishedTechMedia;
  }));

  const cmsMedia: PublishedTechMedia[] = (articleResult.data ?? []).map((record) => {
    const tags = Array.isArray(record.tags) ? record.tags.map(String) : [];
    const placement = String(record.type ?? "").toLowerCase() === "interview" ||
      String(record.category ?? "").toLowerCase().includes("interview") || tags.includes("interview")
      ? "interview"
      : "video";
    return {
      id: String(record.id),
      source_id: null,
      media_type: placement,
      title: String(record.title ?? ""),
      description: String(record.excerpt ?? record.summary ?? ""),
      category: String(record.category ?? (placement === "interview" ? "Interviews" : "Videos")),
      video_path: "",
      video_url: String(record.video_url ?? ""),
      thumbnail_url: String(record.image ?? record.cover_image_url ?? ""),
      host_name: String(record.author ?? ""),
      guest_name: "",
      guest_role: "",
      guest_company: "",
      duration_seconds: 0,
      tags,
      published_at: String(record.published_at ?? record.created_at ?? ""),
    };
  });

  const allMedia = [
    ...uploadedMedia.filter((record): record is PublishedTechMedia => record !== null),
    ...cmsMedia,
  ];
  return allMedia.sort((left, right) => right.published_at.localeCompare(left.published_at));
}

export function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";
    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v") ?? "";
      else if (["/shorts/", "/live/"].some((prefix) => url.pathname.startsWith(prefix))) videoId = url.pathname.split("/")[2] ?? "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function toShortItem(record: PublishedTechMedia, fallbackThumbnail: string): ShortItem {
  return {
    id: `tech-${record.id}`,
    episodeNumber: 0,
    category: record.category,
    subCategory: record.category,
    title: record.title,
    description: record.description,
    author: record.host_name || "NexTake Tech",
    authorRole: "NexTake Tech",
    views: "New",
    duration: formatDuration(record.duration_seconds),
    durationSeconds: record.duration_seconds,
    likes: "",
    shares: "",
    thumbnail: record.thumbnail_url || fallbackThumbnail,
    videoType: "silicon",
    tags: record.tags.length ? record.tags : [record.category],
    videoUrl: record.video_url,
    publishedAt: record.published_at,
  };
}

export function toInterviewItem(record: PublishedTechMedia, fallbackThumbnail: string): InterviewItem {
  return {
    id: `tech-${record.id}`,
    episodeNumber: 0,
    title: record.title,
    category: record.category,
    thumbnail: record.thumbnail_url || fallbackThumbnail,
    duration: formatDuration(record.duration_seconds),
    durationSeconds: record.duration_seconds,
    views: "New",
    viewCountRaw: 0,
    uploadedAgo: record.published_at ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(record.published_at)) : "Recently",
    guest: {
      name: record.guest_name || record.host_name || "NexTake Tech",
      role: record.guest_role || "Guest",
      company: record.guest_company || "NexTake Tech",
      avatar: fallbackThumbnail,
      subscribers: "",
    },
    host: { name: record.host_name || "NexTake Tech", role: "Host" },
    executiveSummary: record.description,
    featuredQuote: { text: "", timestamp: "00:00" },
    chapters: [],
    comments: [],
    tags: record.tags,
    videoUrl: record.video_url,
    publishedAt: record.published_at,
  };
}

export function toPublishedShorts(records: PublishedTechMedia[]) {
  return records
    .filter((record) => record.media_type === "video")
    .map((record, index) => toShortItem(record, SHORTS_LIST[index % SHORTS_LIST.length].thumbnail));
}

export function getUnreplacedShorts(records: PublishedTechMedia[]) {
  const replacedIds = new Set(records
    .filter((record) => record.media_type === "video")
    .map((record) => record.source_id)
    .filter(Boolean));
  return SHORTS_LIST.filter((item) => !replacedIds.has(item.id));
}

export function getUnreplacedInterviews(records: PublishedTechMedia[]) {
  const replacedIds = new Set(records
    .filter((record) => record.media_type === "interview")
    .map((record) => record.source_id)
    .filter(Boolean));
  return ALL_INTERVIEWS.filter((item) => !replacedIds.has(item.id));
}
