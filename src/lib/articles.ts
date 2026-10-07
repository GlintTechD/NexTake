import { supabase } from "./supabase";

export async function getPublishedArticles() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    // Exclude YouTube Shorts, Interviews, and other media-type entries
    // so the hero slideshow only shows editorial articles.
    .not("content_type", "eq", "media")
    .is("media_placement", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading articles:", error);
    throw error;
  }

  return data ?? [];
}