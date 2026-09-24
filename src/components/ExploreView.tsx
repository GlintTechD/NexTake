import React, { useState, useMemo } from 'react';
import { ScreenView, SearchResultItem } from '../types';
import {
  ALL_EXPLORE_ITEMS,
  DOMAIN_TOPICS,
  OPERATORS_LIST,
  COMPANIES_LIST,
} from '../data/mockData';

// ── Team member asset imports ──────────────────────────────────────────────
import imgAkanni from '../assets/Akanni_Promise.png';
import imgFunmi from '../assets/Funmi.jpeg';
import imgNifemi from '../assets/Nifemi_Martins.jpeg';
import imgOlalekan from '../assets/Olalekan_Ajiboye.webp';
import imgPromise from '../assets/Promise_Anyim.jpeg';
import imgSeidu from '../assets/Seidu_Gbotemi.jpeg';
import imgMartins from '../assets/Martins_Enofe.jpeg';
import {
  Search,
  X,
  Bookmark,
  ArrowRight,
  Play,
  Check,
  LayoutGrid,
  List,
  FileText,
  Users,
  Building2,
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 'tm-akanni',
    name: 'Akanni Promise',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgAkanni,
    latestDispatch: 'Full-Stack Developer & Creative Technologist',
    portfolioUrl: 'https://akon-007.github.io/',
  },
  {
    id: 'tm-funmi',
    name: 'Funmi',
    role: 'Creator',
    company: 'Portfolio',
    avatar: imgFunmi,
    latestDispatch: 'Creative Designer & Brand Strategist',
    portfolioUrl: 'https://creatorfunmi.vercel.app/',
  },
  {
    id: 'tm-nifemi',
    name: 'Nifemi Martins',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgNifemi,
    latestDispatch: 'Software Engineer & Tech Innovator',
    portfolioUrl: 'https://ace-xa3.github.io/portfolio-ace/',
  },
  {
    id: 'tm-olalekan',
    name: 'Olalekan Ajiboye',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgOlalekan,
    latestDispatch: 'Frontend Engineer & UI/UX Specialist',
    portfolioUrl: 'https://olalekan-ajiboye-portfolio.vercel.app',
  },
  {
    id: 'tm-promise',
    name: 'Promise Anyim',
    role: 'Professional',
    company: 'LinkedIn',
    avatar: imgPromise,
    latestDispatch: 'Tech Professional & Business Strategist',
    portfolioUrl: 'https://www.linkedin.com/in/promise-job-anyim-25779a26b?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  },
  {
    id: 'tm-seidu',
    name: 'Seidu Gbotemi',
    role: 'Professional',
    company: 'LinkedIn',
    avatar: imgSeidu,
    latestDispatch: 'Technology Professional & Innovator',
    portfolioUrl: 'https://www.linkedin.com/in/seidu-oluwagbotemi-06096b35b',
  },
  {
    id: 'tm-martins',
    name: 'Martins Enofe',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgMartins,
    latestDispatch: 'Software Developer & Creative Builder',
    portfolioUrl: 'https://edonicholas-martins-portfolio.vercel.app',
  },
];


interface ExploreViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  initialQuery?: string;
  onOpenDailyEdit: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
  initialQuery = 'FINTECH',
  onOpenDailyEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [followedPeople, setFollowedPeople] = useState<Record<string, boolean>>({
    'Patrick Collison': true,
  });
  const [followedOrgs, setFollowedOrgs] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const trendingQueries = [
    'AI Agents',
    'Fintech',
    'OpenAI',
    'African Startups',
    'Post-Quantum Cryptography',
    'Silicon Cleanrooms',
    'Humanoid Dexterity',
  ];

  const handleQueryClick = (q: string) => {
    setSearchQuery(q);
    setActiveFilterTab('ALL');
  };

  // Filter items: first by query match (tags or category/title text), then by type tab
  const queryFiltered = useMemo(() => {
    if (!searchQuery.trim()) return ALL_EXPLORE_ITEMS;
    const q = searchQuery.toLowerCase();
    return ALL_EXPLORE_ITEMS.filter((item) => {
      const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
      const titleMatch = item.title.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      const summaryMatch = item.summary.toLowerCase().includes(q);
      return tagMatch || titleMatch || catMatch || summaryMatch;
    });
  }, [searchQuery]);

  const filteredResults = useMemo(() => {
    return queryFiltered.filter((item) => {
      if (activeFilterTab === 'ALL') return true;
      if (activeFilterTab === 'STORIES') return item.type === 'story';
      if (activeFilterTab === 'PEOPLE') return item.type === 'operator';
      if (activeFilterTab === 'COMPANIES') return item.type === 'dossier';
      if (activeFilterTab === 'VIDEOS & SHORTS')
        return item.type === 'short' || item.type === 'interview';
      return true;
    });
  }, [queryFiltered, activeFilterTab]);

  // Counts per tab for current query
  const tabCounts = useMemo(() => ({
    ALL: queryFiltered.length,
    STORIES: queryFiltered.filter((i) => i.type === 'story').length,
    PEOPLE: queryFiltered.filter((i) => i.type === 'operator').length,
    COMPANIES: queryFiltered.filter((i) => i.type === 'dossier').length,
    'VIDEOS & SHORTS': queryFiltered.filter((i) => i.type === 'short' || i.type === 'interview').length,
  }), [queryFiltered]);

  // Top result: first story with a badge or thumbnail
  const topResult = filteredResults.find((i) => i.type === 'story' && (i.badge || i.thumbnail));
  const gridItems = filteredResults.filter((i) => i !== topResult);

  return (
    <div className="bg-[#f8fafc] text-slate-900 pb-20">
      {/* 1. Header Section (matching 2.png) */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              05 • Discovery & knowledge graph
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mt-1">
              Explore Next Edit
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              Search 14,000+ technology dispatches, founder interviews, 60-second shorts, people archives, and sovereign company intelligence.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-6 max-w-3xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across articles, founders, institutions, or ticker codes..."
                className="w-full pl-12 pr-28 py-3.5 rounded-lg border border-slate-300 bg-white font-mono text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 shadow-sm"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  20K / /
                </span>
              </div>
            </div>
          </div>

          {/* Trending Queries */}
          <div className="flex flex-wrap items-center gap-2 mt-5 text-xs font-mono">
            <span className="text-slate-400 font-bold text-[11px]">
              Trending queries:
            </span>
            {trendingQueries.map((query) => (
              <button
                key={query}
                onClick={() => handleQueryClick(query)}
                className={`px-2.5 py-1 rounded transition-colors ${searchQuery.toUpperCase() === query.toUpperCase()
                  ? 'bg-[#00f2aa] text-slate-950 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Results Header & Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2 font-mono">
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider block">
              Query synchronized
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Results for "{searchQuery || 'All'}"
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>{tabCounts.ALL} Results across 5 taxonomies (0.04s)</span>
          </div>
        </div>

        {/* Taxonomy Filters & Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-200 text-xs font-mono">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'ALL', label: 'All', count: tabCounts.ALL },
              { id: 'STORIES', label: 'Stories', count: tabCounts.STORIES },
              { id: 'PEOPLE', label: 'People', count: tabCounts.PEOPLE },
              { id: 'COMPANIES', label: 'Companies', count: tabCounts.COMPANIES },
              { id: 'VIDEOS & SHORTS', label: 'Videos & Shorts', count: tabCounts['VIDEOS & SHORTS'] },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${activeFilterTab === tab.id
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {tab.label} <span className="text-[10px] opacity-75">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Sorters and View Mode */}
          <div className="flex items-center space-x-3">
            <select className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded focus:outline-none">
              <option>Date: Past 30 Days</option>
              <option>Past 24 Hours</option>
              <option>Past 7 Days</option>
              <option>All Time</option>
            </select>

            <select className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded focus:outline-none">
              <option>Sort: Most Relevant</option>
              <option>Newest First</option>
              <option>Most Read</option>
            </select>

            <div className="hidden sm:flex items-center space-x-1 border border-slate-200 bg-white rounded p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Results Grid / Layout - Dynamic */}
        <div className="py-8 space-y-6">

          {/* Top Result Banner */}
          {topResult && topResult.thumbnail && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="text-xs font-mono text-slate-400">
                    {topResult.badge && (
                      <span className="text-emerald-700 font-bold">{topResult.badge}</span>
                    )}
                    <span className="mx-2">•</span>
                    <span>{topResult.category}</span>
                  </div>

                  <h3
                    onClick={() => onNavigate('article', topResult.articleId)}
                    className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 hover:text-emerald-700 transition-colors cursor-pointer leading-tight"
                  >
                    {topResult.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {topResult.summary}
                  </p>

                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 pt-2 text-xs font-mono">
                    {topResult.author && <span className="text-slate-500">{topResult.author}</span>}
                    {topResult.readTime && (
                      <><span className="text-slate-400">•</span><span className="text-slate-500">{topResult.readTime}</span></>
                    )}
                    {topResult.timeAgo && (
                      <><span className="text-slate-400">•</span><span className="text-slate-500">{topResult.timeAgo}</span></>
                    )}

                    <div className="ml-auto flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate('article', topResult.articleId)}
                        className="px-4 py-2 rounded bg-slate-950 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center space-x-1"
                      >
                        <span>Read story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleSave(topResult.id)}
                        className={`p-2 rounded border transition-colors ${savedIds.includes(topResult.id)
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                          : 'border-slate-300 text-slate-500 hover:text-slate-900'
                          }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                    <img
                      src={topResult.thumbnail}
                      alt={topResult.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                      Telemetry: Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Results State */}
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 font-mono text-sm">No results found for "{searchQuery}"</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilterTab('ALL'); }}
                className="mt-4 px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors"
              >
                Clear query
              </button>
            </div>
          )}

          {/* Grid Cards */}
          {gridItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridItems.map((item) => {
                // STORY card
                if (item.type === 'story') {
                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('article', item.articleId)}
                      className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {item.thumbnail && (
                          <div className="aspect-video rounded overflow-hidden mb-3">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                          <span className="text-slate-700 font-bold truncate mr-2">{item.category}</span>
                          {item.timeAgo && <span className="shrink-0">{item.timeAgo}</span>}
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200 mb-2 inline-block">
                            {item.badge}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-100">
                        {item.readTime && <span>{item.readTime}</span>}
                        {item.author && <span className="text-slate-500 truncate">{item.author}</span>}
                        <span className="text-slate-700 font-bold group-hover:text-emerald-700 shrink-0 ml-auto">Analyze ↗</span>
                      </div>
                    </div>
                  );
                }

                // DOSSIER card
                if (item.type === 'dossier') {
                  const initials = item.title.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase();
                  return (
                    <div key={item.id} className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded bg-slate-950 text-white font-mono font-bold text-xs flex items-center justify-center">
                            {initials}
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-950 mb-1">{item.title}</h3>
                        <p className="text-[11px] font-mono text-slate-500 mb-3">{item.category}</p>
                        {(item.valuation || item.hq) && (
                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 mb-3">
                            {item.valuation && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Valuation:</span>
                                <span className="font-bold text-slate-900">{item.valuation}</span>
                              </div>
                            )}
                            {item.hq && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">HQ:</span>
                                <span className="font-bold text-slate-900">{item.hq}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-[11px] font-mono text-slate-600 line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Company dossier
                        </span>
                        <span className="text-slate-400">View profile ↗</span>
                      </div>
                    </div>
                  );
                }

                // SHORT card
                if (item.type === 'short') {
                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('shorts')}
                      className="bg-[#090d14] text-white rounded-lg border border-slate-800 p-5 flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-3">
                          <span className="flex items-center space-x-1">
                            <Play className="w-3 h-3 fill-current" />
                            <span>{item.category}</span>
                          </span>
                          <span className="text-slate-400">{item.duration}</span>
                        </div>
                        {item.badge && (
                          <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">{item.badge}</div>
                        )}
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
                        <span>{item.views}</span>
                        <span className="text-emerald-400 font-bold">Watch clip ↗</span>
                      </div>
                    </div>
                  );
                }

                // OPERATOR card
                if (item.type === 'operator') {
                  const operatorData = OPERATORS_LIST.find((o) => o.name === item.title);
                  return (
                    <div key={item.id} className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
                      <div>
                        {item.badge && (
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 mb-3 inline-block">
                            {item.badge}
                          </span>
                        )}
                        <div className="flex items-center space-x-3 mb-3">
                          {operatorData?.avatar ? (
                            <img
                              src={operatorData.avatar}
                              alt={item.title}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                            <p className="text-[11px] font-mono text-slate-500">{item.category}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.summary}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 text-xs font-mono text-slate-400">
                        {operatorData?.latestDispatch && (
                          <span className="font-bold text-slate-700">↳ {operatorData.latestDispatch}</span>
                        )}
                      </div>
                    </div>
                  );
                }

                // INTERVIEW card
                if (item.type === 'interview') {
                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('interview')}
                      className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                          <span className="text-slate-700 font-bold">{item.badge || 'The Edit Interviews'}</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3 relative">
                          <img
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                          />
                          {item.duration && (
                            <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 text-white px-2 py-0.5 rounded">
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-100">
                        <span className="text-slate-500">The Edit Studio</span>
                        <span className="text-emerald-700 font-bold">{item.category}</span>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}

          {filteredResults.length > 6 && (
            <div className="text-center pt-4">
              <button
                onClick={() => alert(`Loaded ${filteredResults.length} results for "${searchQuery}".`)}
                className="px-6 py-2.5 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-mono font-bold tracking-wider inline-flex items-center space-x-2 shadow-sm transition-colors"
              >
                <span>Load next 20 results ⇅</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. DOMAIN MATRIX / EXPLORE BY TOPIC (matching 2.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              Domain matrix
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Explore by Topic
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-lg">
            Granular taxonomies monitored continuously across high-throughput telemetry pipelines and investigative source networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAIN_TOPICS.map((topic) => {
            const isSelected = topic.name.toUpperCase().includes(searchQuery.toUpperCase());
            return (
              <div
                key={topic.id}
                onClick={() => setSearchQuery(topic.name)}
                className={`p-5 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between ${isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  {isSelected && (
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      Focused query
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 ml-auto" />}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {topic.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 mt-3 border-t border-slate-100">
                  <span>{topic.stories} Stories</span>
                  <span>{topic.shorts} Shorts</span>
                </div>

                {isSelected && (
                  <div className="w-full h-0.5 bg-emerald-500 rounded-full mt-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Trending in This Domain & High-Velocity Enterprises (matching 2.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Trending in This Domain - People */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-900">
                Knowledge base • People / Trending in this domain
              </span>
              <span className="text-xs font-mono text-slate-400">07 matched</span>
            </div>

            <div className="space-y-3">
              {TEAM_MEMBERS.map((person) => (
                <a
                  key={person.id}
                  href={person.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3 hover:border-emerald-300 hover:shadow-sm transition-all group cursor-pointer no-underline"
                >
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="truncate flex-1">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">{person.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {person.role} • {person.company}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {person.latestDispatch}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* High-Velocity Enterprises */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-900">
                Knowledge base • Orgs / High-velocity enterprises
              </span>
              <span className="text-xs font-mono text-slate-400">05 monitored</span>
            </div>

            <div className="space-y-3">
              {COMPANIES_LIST.slice(0, 4).map((org) => (
                <div
                  key={org.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded bg-slate-950 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {org.tag}
                  </div>
                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{org.name}</span>
                      <span className="px-1 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        {org.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {org.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Banner (matching 2.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#090d14] text-white rounded-xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              • The Daily Edit Wire
            </span>
            <h2 className="text-2xl font-black">
              Stay ahead of what's next.
            </h2>
            <p className="text-xs text-slate-400">
              Curated investigative intelligence delivered directly to 84,000+ technology leaders, principal engineers, and venture partners at 08:00 UTC.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
            <input
              type="email"
              placeholder="corporate.email@domain.com"
              className="px-3.5 py-2 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={onOpenDailyEdit}
              className="px-4 py-2 rounded bg-[#00f2aa] text-slate-950 font-mono font-bold text-xs tracking-wider shrink-0 hover:bg-[#00df9c] transition-colors"
            >
              Synchronize
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
