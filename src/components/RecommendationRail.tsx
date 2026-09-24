import { useEffect, useState } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { ScreenView } from '../types';
import { getPublishedArticles } from '../lib/articles';
import { isSupabaseConfigured } from '../lib/supabase';
import { rankRecommendations, type RecommendationArticle } from '../lib/recommendations';
import { getVisitorProfile, rememberShownArticles, setVisitorInterests } from '../lib/visitorProfile';

const INTERESTS = ['AI', 'Cybersecurity', 'Startups', 'Programming', 'Networking', 'Hardware'];

interface RecommendationRailProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
}

export function RecommendationRail({ onNavigate }: RecommendationRailProps) {
  const [articles, setArticles] = useState<RecommendationArticle[]>([]);
  const [interests, setInterests] = useState<string[]>(() => getVisitorProfile().interests);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getPublishedArticles()
      .then((records) => {
        const candidates = records.map((record) => ({
          id: record.id,
          title: record.title,
          category: record.category,
          keywords: record.keywords ?? [],
          publishedAt: record.published_at ?? record.created_at,
          views: record.views,
        }));
        const profile = getVisitorProfile();
        const recommendations = rankRecommendations(candidates, {
          interests: profile.interests,
          readArticleIds: profile.history.map((entry) => entry.articleId),
          readKeywords: profile.history.flatMap((entry) => entry.keywords),
          shownArticleIds: profile.shownArticleIds,
        });
        setArticles(recommendations.map((entry) => entry.article));
        rememberShownArticles(recommendations.map((entry) => entry.article.id));
      })
      .catch((error) => console.error('Failed to load recommendations:', error));
  }, [interests]);

  const toggleInterest = (interest: string) => {
    const next = interests.includes(interest)
      ? interests.filter((value) => value !== interest)
      : [...interests, interest];
    setInterests(next);
    setVisitorInterests(next);
  };

  if (!isSupabaseConfigured || articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200" aria-label="Recommended stories">
      <div className="flex flex-col gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">Adaptive briefing</span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Recommended for you</h2>
          </div>
          <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Choose interests">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${interests.includes(interest) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.slice(0, 6).map((article) => (
          <button key={article.id} type="button" onClick={() => onNavigate('article', article.id)} className="group text-left rounded-lg border border-slate-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">{article.category || 'Technology'}</span>
            <h3 className="mt-2 text-sm font-bold leading-snug text-slate-950 group-hover:text-emerald-700">{article.title}</h3>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500">Read story <ArrowRight className="w-3 h-3" /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
