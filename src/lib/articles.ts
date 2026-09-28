import { supabase } from "./supabase";

export async function getPublishedArticles() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading articles:", error);
    throw error;
  }

  return data ?? [];
}