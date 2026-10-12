import { supabase } from "./supabase";

export async function getPublishedArticles() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        // Exclude YouTube Shorts, Interviews, and other media-type entries
        // so the hero slideshow only shows editorial articles.
        .not("content_type", "eq", "media")
        .is("media_placement", null)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
      if (error) {
        console.warn("Supabase load articles failed:", error);
      }
    } catch (err) {
      console.warn("Supabase load articles failed:", err);
    }
  }

  // Fallback to Express backend API if Supabase is not connected
  if (typeof fetch === 'function') {
    try {
      const response = await fetch('/api/public/content');
      if (response.ok) {
        const payload = (await response.json()) as { items?: any[] };
        const items = (payload.items ?? [])
          .filter((item) => {
            const type = String(item.contentType ?? item.content_type ?? '').toLowerCase();
            const status = String(item.status ?? '').toLowerCase();
            return status === 'published' && !['media', 'short', 'interview'].includes(type);
          })
          .map((item) => ({
            ...item,
            id: item.id || item.slug,
            title: item.title,
            category: item.category || 'Technology',
            excerpt: item.description || item.body?.slice(0, 160) || '',
            image: item.coverImage || item.cover_image || item.image || '',
            read_time: item.readTime || item.read_time || '5 min read',
            created_at: item.publishedAt || item.published_at || item.createdAt || item.created_at,
          }));

        if (items.length > 0) {
          return items;
        }
      }
    } catch {
      // ignore
    }
  }
  return [];
}
