import { supabase } from "./supabase";

export async function getPublishedArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("is_big_story", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading articles:", error);
    throw error;
  }

  return data ?? [];
}

export async function getPublishedArticleById(id: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data;
}