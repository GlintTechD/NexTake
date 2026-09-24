import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenView } from '../types';
import { HeroSlideshow } from './HeroSlideshow';
import {
  FEATURED_ARTICLE,
  SHORTS_LIST,
  FEATURED_INTERVIEW,
  BIG_STORY,
  LATEST_DISPATCHES,
  DOMAIN_TOPICS,
  OPERATORS_LIST,
} from '../data/mockData';

// ── Team member asset imports ──────────────────────────────────────────────
import imgAkanni from '../assets/Akanni_Promise.png';
import imgFunmi from '../assets/Funmi.jpeg';
import imgNifemi from '../assets/Nifemi_Martins.jpeg';
import imgOlalekan from '../assets/Olalekan_Ajiboye.webp';
import imgPromise from '../assets/Promise_Anyim.jpeg';
import imgSeidu from '../assets/Seidu_Gbotemi.jpeg';
import imgMartins from '../assets/Martins_Enofe.jpeg';

const TEAM_MEMBERS = [
  {
    id: 'tm-akanni',
    name: 'Akanni Promise',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgAkanni,
    portfolioUrl: 'https://akon-007.github.io/',
  },
  {
    id: 'tm-funmi',
    name: 'Odusanya Oluwafunmilayo',
    role: 'Creator',
    company: 'Portfolio',
    avatar: imgFunmi,
    portfolioUrl: 'https://creatorfunmi.vercel.app/',
  },
  {
    id: 'tm-nifemi',
    name: 'Nifemi Martins',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgNifemi,
    portfolioUrl: 'https://ace-xa3.github.io/portfolio-ace/',
  },
  {
    id: 'tm-olalekan',
    name: 'Olalekan Ajiboye',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgOlalekan,
    portfolioUrl: 'https://olalekan-ajiboye-portfolio.vercel.app',
  },
  {
    id: 'tm-promise',
    name: 'Promise Anyim',
    role: 'Professional',
    company: 'LinkedIn',
    avatar: imgPromise,
    portfolioUrl: 'https://www.linkedin.com/in/promise-job-anyim-25779a26b?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  },
  {
    id: 'tm-seidu',
    name: 'Seidu Gbotemi',
    role: 'Professional',
    company: 'LinkedIn',
    avatar: imgSeidu,
    portfolioUrl: 'https://www.linkedin.com/in/seidu-oluwagbotemi-06096b35b',
  },
  {
    id: 'tm-martins',
    name: 'Martins Enofe',
    role: 'Developer',
    company: 'Portfolio',
    avatar: imgMartins,
    portfolioUrl: 'https://edonicholas-martins-portfolio.vercel.app',
  },
];

import {
  getLatestArticles,
  getPublishedBigStories,
  type Article as SupabaseArticle,
  type LatestArticle,
} from "../lib/supabase";

import {
  ArrowRight,
  Bookmark,
  Share2,
  Play,
  Check,
  ChevronRight,
  ChevronLeft,
  Headphones,
  SlidersHorizontal,
  Plus,
  ExternalLink,
} from 'lucide-react';
import {
  getDailyEditItems,
  type DailyEditItem,
} from '../lib/supabase';

interface HomeFeedProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDailyEdit: () => void;
  onOpenContact?: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
  onOpenDailyEdit,
  onOpenContact,
}) => {


  const [latestArticles, setLatestArticles] = useState<LatestArticle[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);
  const [publishedBigStories, setPublishedBigStories] = useState<SupabaseArticle[]>([]);

  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedType, setSelectedType] = useState("All Types");

  const [searchQuery, setSearchQuery] = useState("");


  const [followedOperators, setFollowedOperators] = useState<Record<string, boolean>>({
    'op-patrick': true,
  });
  const [followedCompanies, setFollowedCompanies] = useState<Record<string, boolean>>({});
  const [tickerIndex, setTickerIndex] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [dailyEditItems, setDailyEditItems] = useState<DailyEditItem[]>([]);
  const [dailyEditLoading, setDailyEditLoading] = useState(true);

  const tickerAlerts = [
    '#842 Real-time protocol telemetry: Anthropic & DeepMind release architectural proofs',
    '#841 Global hardware runtimes: TSMC commits 2nm fab access to allied silicon program',
    '#840 SWIFT runtime migration: 14 tier-one clearing houses complete latency overhaul',
    '#839 Regulatory dispatch: EU commissions first autonomous agent auditing framework',
  ];

  // Auto-cycle top ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAlerts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickerAlerts.length]);

  const toggleOperatorFollow = (id: string) => {
    setFollowedOperators((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompanyFollow = (id: string) => {
    setFollowedCompanies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setTimeout(() => setEmailSubscribed(false), 4000);
      setEmailInput('');
    }
  };
  useEffect(() => {
    const loadLatestArticles = async () => {
      setLatestLoading(true);

      const articles = await getLatestArticles();

      console.log("Published articles:", articles);

      setLatestArticles(articles);
      setLatestLoading(false);
    };

    loadLatestArticles();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBigStories = async () => {
      const stories = await getPublishedBigStories();
      if (isMounted) setPublishedBigStories(stories);
    };

    void loadBigStories();
    const refreshTimer = window.setInterval(loadBigStories, 24 * 60 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const activeBigStory = (() => {
    if (publishedBigStories.length === 0) return BIG_STORY;

    const story = publishedBigStories[0];
    const description = story.excerpt ?? story.description ?? "";

    return {
      id: story.id,
      tag: story.category ?? "Technology",
      meta: `By ${story.author ?? "NexTake Editorial"} • ${story.read_time ?? story.readTime ?? "5 min read"}`,
      title: story.title,
      description,
      takeaways: [
        { num: "01", label: "What happened", text: description },
        { num: "02", label: "Why it matters", text: story.content ?? description },
        { num: "03", label: "Read the full brief", text: "Open the complete story for the full context and analysis." },
      ],
    };
  })();
  const filteredArticles = latestArticles.filter((article) => {
    const matchesCategory =
      activeCategoryTab === "All" ||
      article.category.toLowerCase() ===
      activeCategoryTab.toLowerCase();

    const matchesTopic =
      selectedTopic === "All Topics" ||
      article.topic.toLowerCase() ===
      selectedTopic.toLowerCase();

    const matchesType =
      selectedType === "All Types" ||
      article.type.toLowerCase() ===
      selectedType.toLowerCase();

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      article.topic.toLowerCase().includes(query);

    return (
      matchesCategory &&
      matchesTopic &&
      matchesType &&
      matchesSearch
    );
  });
  useEffect(() => {
    const loadDailyEdit = async () => {
      setDailyEditLoading(true);

      const items = await getDailyEditItems();

      console.log("Daily Editorial from Supabase:", items);

      setDailyEditItems(items);
      setDailyEditLoading(false);
    };

    loadDailyEdit();
  }, []);

  return (
    <div className="bg-[#f8fafc] text-slate-900 pb-20">
      {/* 1. Top Real-Time Trending Ticker */}
      <div className="bg-[#0b1017] text-white border-b border-[#1a2330] py-2 px-4 sm:px-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <span className="flex items-center space-x-2 text-emerald-400 font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span style={{ fontFamily: 'Georgia, serif' }}>• Trending:</span>
            </span>
            <span
              style={{ fontFamily: 'Arial, sans-serif' }}
              className="text-slate-300 truncate font-['Arial',sans-serif]"
            >
              {tickerAlerts[tickerIndex]}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Editorial Hero Slideshow with connected Story Sidebar */}
      <HeroSlideshow
        onNavigate={onNavigate}
        savedIds={savedIds}
        onToggleSave={onToggleSave}
      />

      {/* 3. YOUR DAILY EDIT - 5 things worth knowing today */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              Curated telemetry
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Your Daily Edit
            </h2>
            <p className="text-xs text-slate-500">5 things worth knowing today.</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-mono bg-white text-slate-700 border border-slate-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-800">4 new dispatches since your last visit</span>
              <span className="text-slate-500">(Today 08:30 AM)</span>
            </span>
          </div>
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dailyEditLoading ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-xs font-mono text-slate-400">
                Loading today's editorial...
              </p>
            </div>
          ) : dailyEditItems.length === 0 ? (
            <div className="col-span-full py-10 text-center">
              <p className="text-xs font-mono text-slate-400">
                No published editorial stories available.
              </p>
            </div>
          ) : (
            dailyEditItems.map((item) => (
              <div
                key={item.id}

                className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {item.num}
                    </span>

                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 mt-3 border-t border-slate-100">
                  <span>{item.timeAgo}</span>
                  <span>{item.readTime}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. NEXT EDIT SHORTS - Tech stories in under 60 seconds (matching 6.png) */}
      <section className="bg-[#090d14] text-white py-12 border-b border-[#1b2533]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Next Edit Shorts
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Tech stories in under 60 seconds.
              </p>
            </div>

            <button
              onClick={() => onNavigate('shorts')}
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>See all shorts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Vertical Preview Reels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SHORTS_LIST.map((short) => (
              <div
                key={short.id}
                onClick={() => onNavigate('shorts')}
                className="group relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer aspect-[9/14] flex flex-col justify-between p-3"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/70 text-emerald-400 border border-emerald-500/30">
                    {short.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black/70 text-slate-300">
                    {short.duration.split(' ')[0]}
                  </span>
                </div>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="w-12 h-12 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors mb-2">
                    {short.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{short.author}</span>
                    <span className="text-emerald-400 font-bold">{short.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE BIG STORY (matching 6.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="mb-6">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
            Deep focus • Brief
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            The Big Story
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono text-slate-500 font-medium">
                <span className="text-emerald-700 font-bold">{activeBigStory.tag}</span>
                <span className="mx-2">•</span>
                <span>{activeBigStory.meta}</span>
              </div>

              <h3
                onClick={() => onNavigate('article', activeBigStory.id)}
                className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 hover:text-emerald-700 transition-colors cursor-pointer leading-tight"
              >
                {activeBigStory.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {activeBigStory.description}
              </p>

              <div>
                <button
                  onClick={() => onNavigate('article', activeBigStory.id)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-slate-950 text-white text-xs font-mono font-bold hover:bg-emerald-600 transition-colors"
                >
                  <span>Read the full breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Takeaway Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {activeBigStory.takeaways.map((takeaway) => (
                  <div
                    key={takeaway.num}
                    className="p-3 rounded bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center space-x-1.5 font-mono text-[10px] text-emerald-700 font-bold mb-1">
                      <span>{takeaway.num}</span>
                      <span>{takeaway.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {takeaway.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Map Graphic Simulation */}
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-4 aspect-[4/3] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">Computational network</span>
                  <span>Europe & Asia hubs</span>
                </div>

                {/* SVG Network Map Graphic */}
                <div className="my-auto py-4 relative flex items-center justify-center">
                  <svg
                    viewBox="0 0 400 200"
                    className="w-full h-auto text-emerald-400 stroke-current opacity-80"
                    fill="none"
                  >
                    {/* Globe contours */}
                    <path
                      d="M 50 100 Q 100 20 200 20 Q 300 20 350 100 Q 300 180 200 180 Q 100 180 50 100 Z"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      className="text-slate-700"
                    />
                    <path
                      d="M 200 20 L 200 180 M 50 100 L 350 100"
                      strokeWidth="0.5"
                      strokeDasharray="3 3"
                      className="text-slate-700"
                    />

                    {/* Nodes and Links */}
                    <circle cx="120" cy="70" r="4" fill="#00f2aa" />
                    <text x="130" y="73" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                      Paris • 24k H100
                    </text>

                    <circle cx="280" cy="85" r="4" fill="#00f2aa" />
                    <text x="290" y="88" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                      Tokyo • 40k H100
                    </text>

                    <circle cx="170" cy="110" r="4" fill="#00f2aa" />
                    <text x="180" y="113" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                      Dubai • 32k H100
                    </text>

                    {/* Sovereign connection lines */}
                    <path
                      d="M 120 70 Q 200 60 280 85"
                      stroke="#00f2aa"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    <path
                      d="M 120 70 L 170 110"
                      stroke="#00f2aa"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 170 110 L 280 85"
                      stroke="#00f2aa"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                  <span>Monograph dispatch #412</span>
                  <span className="text-emerald-400">Federation live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST Feed (matching 6.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              What&apos;s new
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Latest
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
            <span>Feed updated every 5 minutes</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'AI', 'Fintech', 'Startups', 'Cybersecurity', 'Hardware'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded transition-colors ${activeCategoryTab === cat
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded focus:outline-none focus:border-slate-400"
            >
              <option>All Topics</option>
              <option>Deep Learning</option>
              <option>Venture Capital</option>
              <option>Silicon Fabs</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded focus:outline-none focus:border-slate-400"
            >
              <option>All Types</option>
              <option>Dispatches</option>
              <option>Monographs</option>
              <option>Interviews</option>
            </select>
          </div>
        </div>

        {/* Latest Dispatches List */}
        <div className="space-y-4">
          {latestLoading ? (
            <div className="py-10 text-center">
              <p className="text-sm font-mono text-slate-400">
                Loading stories...
              </p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-200 rounded-lg">
              <p className="text-sm font-mono text-slate-400">
                No stories match your filters.
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onNavigate("article", article.id)}
                className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {article.category}
                    </span>

                    <span>•</span>

                    <span>{article.timeAgo}</span>

                    <span>•</span>

                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(article.id);
                    }}
                    className={`p-2 rounded border transition-colors ${isSaved(article.id)
                      ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                      : "text-slate-400 hover:text-slate-700 border-slate-200"
                      }`}
                    title="Save Story"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("article", article.id);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-50 text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-colors text-xs font-mono font-bold flex items-center space-x-1"
                  >
                    <span>Read →</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-2.5 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-mono font-bold tracking-wider inline-flex items-center space-x-2 shadow-sm transition-colors"
          >
            <span>Load more stories ⤓</span>
          </button>

        </div>
      </section>

      {/* 7. EXPLORE TOPICS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              Taxonomy
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Explore Topics
            </h2>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center space-x-1"
          >
            <span>Explore all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAIN_TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onNavigate('explore', topic.name)}
              className="bg-white p-5 rounded-lg border border-slate-200 hover:border-emerald-500/80 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {topic.stories} Stories • {topic.shorts} Shorts
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* 8. INTERVIEWS (matching 6.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
              The Edit
            </span>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Interviews
            </h2>
          </div>

          <button
            onClick={() => onNavigate('interview')}
            className="text-xs font-mono font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center space-x-1"
          >
            <span>View all interviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured Interview Card (Dario Amodei) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8">
            {/* Thumbnail with Play Trigger */}
            <div
              onClick={() => onNavigate('interview')}
              className="lg:col-span-6 relative rounded-lg overflow-hidden bg-slate-950 aspect-video group cursor-pointer"
            >
              <img
                src={FEATURED_INTERVIEW.thumbnail}
                alt={FEATURED_INTERVIEW.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-emerald-400 border border-emerald-500/40">
                  Episode #42 • 4K HDR
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-black/80 text-white">
                  35:45 min
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono text-slate-500">
                <span className="text-emerald-700 font-bold">Featured spotlight</span>
              </div>

              <h3
                onClick={() => onNavigate('interview')}
                className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 hover:text-emerald-700 transition-colors cursor-pointer leading-tight"
              >
                {FEATURED_INTERVIEW.title}
              </h3>

              <div className="flex items-center space-x-3 py-1">
                <img
                  src={FEATURED_INTERVIEW.guest.avatar}
                  alt={FEATURED_INTERVIEW.guest.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-mono">
                    {FEATURED_INTERVIEW.guest.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {FEATURED_INTERVIEW.guest.role}, {FEATURED_INTERVIEW.guest.company}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                In this deep-dive conversation, Dario discusses recursive self-improvement guardrails, compute scaling walls, and how Anthropic plans to manage the emergence of autonomous code synthesizers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('interview')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-slate-950 text-white text-xs font-mono font-bold hover:bg-emerald-600 transition-colors"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Listen to audio dispatch</span>
                </button>

                <button
                  onClick={() => onNavigate('interview')}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded border border-slate-300 text-slate-700 text-xs font-mono hover:bg-slate-50 transition-colors"
                >
                  <span>Full transcript</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Secondary Interview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('interview')}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="aspect-video bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
                alt="Fei-Fei Li"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                28:15 min
              </span>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Fei-Fei Li • Stanford / World Labs
              </span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                The Future of Human-AI Interaction Models
              </h4>
            </div>
          </div>

          <div
            onClick={() => onNavigate('interview')}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="aspect-video bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
                alt="Patrick Collison"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                34:20 min
              </span>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Patrick Collison • Stripe
              </span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                The Programmable Economy and Autonomous Agent Billing
              </h4>
            </div>
          </div>

          <div
            onClick={() => onNavigate('interview')}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer group"
          >
            <div className="aspect-video bg-slate-900 relative">
              <img
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80"
                alt="Jensen Huang"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded">
                32:50 min
              </span>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Jensen Huang • Nvidia
              </span>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Accelerated Computing and the Next Industrial Revolution
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PEOPLE & COMPANIES (matching 6.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="mb-8 pb-3 border-b border-slate-200">
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
            Feed personalization
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            People & Companies
          </h2>
          <p className="text-xs text-slate-500">
            Follow key decision-makers and high-growth technology enterprises to personalize your feed.
          </p>
        </div>

        {/* Operators */}
        <div className="mb-6">
          <h3 className="text-xs font-mono text-slate-400 tracking-wider font-semibold mb-3">
            Operators &amp; Researchers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEAM_MEMBERS.map((op) => (
              <a
                key={op.id}
                href={op.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center gap-2.5 hover:border-emerald-300 hover:shadow-sm transition-all group no-underline"
              >
                <div className="flex items-center space-x-2.5 truncate flex-1">
                  <img
                    src={op.avatar}
                    alt={op.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {op.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {op.company}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">↗</span>
              </a>
            ))}
          </div>
        </div>

      </section>

      {/* 10. STAY AHEAD OF WHAT\'S NEXT (Newsletter CTA - matching 6.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-[#090d14] text-white rounded-2xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          {/* Background decorative technical grid lines */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border border-emerald-400"></div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider">
              Synchronize briefing
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Stay ahead of what&apos;s next.
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Get the most important technology stories, insights, and updates delivered to your inbox every morning at 07:00 UTC.
            </p>

            <form onSubmit={handleEmailSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="corporate.email@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="px-4 py-3 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400 flex-grow"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider transition-colors shrink-0"
              >
                {emailSubscribed ? 'Synchronized ✓' : 'Get the Daily Edit →'}
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-2 gap-3">
              <span>Zero spam • Unsubscribe anytime. Strict data protocol.</span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center space-x-1"
                >
                  <span>Contact Editorial Wire →</span>
                </button>
                <span className="text-slate-700">•</span>
                <button
                  type="button"
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Explore Archive →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
