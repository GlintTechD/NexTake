import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Search } from 'lucide-react';
import type { ScreenView } from '../types';
import { getLatestPublishedStories, type LatestStory } from '../lib/latest';

interface LatestViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const LatestView: React.FC<LatestViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
}) => {
  const [stories, setStories] = useState<LatestStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const loadStories = async (showLoading: boolean) => {
      if (showLoading && isMounted) setIsLoading(true);

      try {
        const publishedStories = await getLatestPublishedStories();
        if (!isMounted) return;
        setStories(publishedStories);
        setLoadError(false);
        setActiveCategory((current) =>
          current === 'All' || publishedStories.some((story) => story.category === current)
            ? current
            : 'All',
        );
      } catch (error) {
        console.error('Unable to load the Latest feed:', error);
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted && showLoading) setIsLoading(false);
      }
    };

    void loadStories(true);
    const refreshInterval = window.setInterval(() => void loadStories(false), 5 * 60 * 1000);
    const handleFocus = () => void loadStories(false);
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(stories.map((story) => story.category.trim()).filter(Boolean)),
    );
    return ['All', ...uniqueCategories];
  }, [stories]);

  const visibleStories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stories.filter((story) => {
      const matchesCategory = activeCategory === 'All' || story.category === activeCategory;
      const matchesQuery = !query || [
        story.title,
        story.description,
        story.category,
        story.author,
        ...story.tags,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery, stories]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-emerald-700">
              Published stories
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Latest
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Articles and blogs published across the Daily Edit, Big Story, and Latest feeds.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <span className="font-bold text-slate-950">{stories.length}</span>
            <span className="ml-1 text-slate-500">
              {stories.length === 1 ? 'published story' : 'published stories'}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Filter by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === category
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              placeholder="Search published stories"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500">
            Loading published stories…
          </div>
        ) : loadError && stories.length === 0 ? (
          <div className="rounded-xl border border-rose-200 bg-white px-5 py-16 text-center">
            <p className="font-semibold text-slate-900">Published stories could not be loaded.</p>
            <p className="mt-2 text-sm text-slate-500">Please try again in a moment.</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <p className="font-semibold text-slate-900">No published articles or blogs yet.</p>
            <p className="mt-2 text-sm text-slate-500">Published stories will appear here.</p>
          </div>
        ) : visibleStories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center text-sm text-slate-500">
            No published stories match your search.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleStories.map((story) => {
              const hasImage = Boolean(story.image);
              const isSaved = savedIds.includes(story.id);

              return (
                <article
                  key={story.id}
                  className={`group relative isolate flex min-h-64 flex-col overflow-hidden rounded-xl border transition hover:shadow-lg ${hasImage
                    ? 'border-slate-800 bg-slate-950 text-white hover:border-emerald-400/70'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                    }`}
                >
                  {hasImage && (
                    <>
                      <img
                        src={story.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/60 to-black/35" />
                    </>
                  )}

                  <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
                    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono ${hasImage ? 'text-white/80' : 'text-slate-500'}`}>
                      <span className={`rounded px-2 py-1 font-bold ${hasImage
                        ? 'border border-white/30 bg-black/35 text-white backdrop-blur-sm'
                        : 'bg-emerald-50 text-emerald-800'
                        }`}>
                        {story.sourceLabel}
                      </span>
                      {story.category && <span>{story.category}</span>}
                      {story.timeAgo && <span>• {story.timeAgo}</span>}
                      <span>• {story.readTime}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate('article', story.id)}
                      className={`mt-4 text-left text-lg font-bold leading-snug transition-colors ${hasImage
                        ? 'text-white hover:text-emerald-200'
                        : 'text-slate-950 hover:text-emerald-700'
                        }`}
                    >
                      {story.title}
                    </button>

                    {story.description && (
                      <p className={`mt-2 line-clamp-3 text-sm leading-6 ${hasImage ? 'text-white/85' : 'text-slate-600'}`}>
                        {story.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                      {story.author && (
                        <span className={`truncate text-xs ${hasImage ? 'text-white/75' : 'text-slate-500'}`}>
                          By {story.author}
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleSave(story.id)}
                          aria-label={isSaved ? 'Remove saved story' : 'Save story'}
                          title={isSaved ? 'Remove saved story' : 'Save story'}
                          className={`rounded-lg border p-2 transition-colors ${isSaved
                            ? 'border-emerald-300 bg-emerald-400 text-slate-950'
                            : hasImage
                              ? 'border-white/40 bg-black/25 text-white hover:bg-black/50'
                              : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900'
                            }`}
                        >
                          <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('article', story.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
                        >
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
