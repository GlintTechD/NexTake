const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);

export const getYouTubeVideoId = (value?: string | null): string | null => {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (url.hostname.toLowerCase() === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (url.pathname === '/watch') return url.searchParams.get('v');
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') return parts[1] || null;
    return null;
  } catch {
    return null;
  }
};

export const isYouTubeVideoUrl = (value?: string | null): boolean => Boolean(getYouTubeVideoId(value));

export const toYouTubeEmbedUrl = (value: string): string => {
  const id = getYouTubeVideoId(value);
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1` : value;
};
