import React, { useState, useMemo, useEffect } from 'react';
import { ScreenView } from '../types';
import { STARTUP_PROFILES } from '../data/startupProfilesData';
import { getPublishedStartups, type PublicStartup } from '../lib/publicIntelligence';
import {
  Share2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Bookmark,
  X,
  Calculator,
  Award,
  ArrowRight,
  Building2,
  FileText,
} from 'lucide-react';

import startupsAgritechHero from '../components/assests/startups_agritech_hero_1790590245491.jpg';
import solarRooftopTech from '../components/assests/solar_rooftop_tech_1790590259135.jpg';
import fintechWealthApp from '../components/assests/fintech_wealth_app_1790590273662.jpg';
import paystackHeroPhone from '../components/assests/paystack_hero_phone_1790603559167.jpg';

interface StartupsViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenContact?: () => void;
}

interface EditorialStory {
  id: string;
  category: string;
  title: string;
  deck: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  isTopStory?: boolean;
  articleId?: string;
  startupId?: string;
  tag?: string;
}

const EDITORIAL_STORIES: EditorialStory[] = [
  {
    id: 'story-paystack-expansion',
    category: 'Startups',
    title: 'Paystack pushes deeper into Africa with new product suite for businesses',
    deck: 'The Nigerian fintech company is expanding its product offering to help businesses across Africa accept payments, manage operations and grow more efficiently.',
    author: 'Next Take',
    date: '28 Sep 2026',
    readTime: '6 min read',
    image: paystackHeroPhone,
    isTopStory: true,
    articleId: 'dispatch-fintech-rails',
    startupId: 'paystack',
    tag: 'FEATURED VENTURE',
  },
  {
    id: 'story-ile-ayaba',
    category: 'Agritech',
    title: 'How Ilé Ayaba Is Digitizing Smallholder Farm Yields & Post-Harvest Cold Chains',
    deck: "From decentralized solar grain storage to automated institutional buyer routing, the Oyo-based agritech venture is turning smallholder harvest losses into predictable trade surpluses for 12,000 rural farmers.",
    author: 'Damilola Aina',
    date: '24th Sep 2026',
    readTime: '6 min read',
    image: startupsAgritechHero,
    isTopStory: false,
    articleId: 'dispatch-842',
    startupId: 'ile-ayaba',
    tag: 'TOP STORY',
  },
  {
    id: 'story-acumen-sun-king',
    category: 'Startups',
    title: 'Acumen Backs Sun King With $5 Million To Expand Solar Access In Zambia',
    deck: 'The climate debt facility unlocks commercial distributed minigrids and pay-as-you-go residential solar kits across rural copperbelt agricultural districts.',
    author: 'John Adoyi',
    date: '23rd Sep 2026',
    readTime: '4 min read',
    image: solarRooftopTech,
    articleId: 'dispatch-842',
    startupId: 'sun-king',
  },
  {
    id: 'story-rank-yc',
    category: 'FinTech',
    title: 'Nigeria’s Savers Have Money. YC-Backed Rank Wants To Turn It Into Wealth.',
    deck: 'High local inflation led 240,000 retail savers to seek alternative wealth preservation. Rank is rolling out algorithmic tokenized treasury yields with instant liquidity.',
    author: 'Temitayo Jaiyeola',
    date: '22nd Sep 2026',
    readTime: '5 min read',
    image: fintechWealthApp,
    articleId: 'dispatch-fintech-rails',
    startupId: 'rank-wealth',
  },
  {
    id: 'story-stitch-retail',
    category: 'FinTech',
    title: 'South Africa’s Stitch Secures Bank of Choice Status With Major Pan-African Retailers',
    deck: 'By bypassing legacy card networks in favor of direct bank-to-bank settlement, Stitch is cutting merchant processing overhead by 65%.',
    author: 'Gugulethu Ndlovu',
    date: '21st Sep 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-fintech-rails',
    startupId: 'stitch',
  },
  {
    id: 'story-omni-traction',
    category: 'Acquisitions',
    title: 'OmniRetail Acquires Traction to Consolidate Merchant POS & FMCG Logistics Across West Africa',
    deck: 'The cash-and-stock deal unites informal retailer inventory fulfillment with embedded credit facilities across 80,000 neighborhood storefronts.',
    author: 'Muktar Oladipo',
    date: '20th Sep 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-yc-agents',
    startupId: 'omni-retail',
  },
  {
    id: 'story-octamile-climate',
    category: 'Climate',
    title: 'Octamile Introduces Parametric Crop Insurance for East African Agritech Cooperatives',
    deck: 'Using satellite weather telemetry and automated smart contracts, payouts are disbursed within 24 hours of drought threshold breaches.',
    author: 'Fadekemi Abiru',
    date: '19th Sep 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-842',
    startupId: 'octamile',
  },
  {
    id: 'story-wasoko-maxab',
    category: 'Ecommerce',
    title: 'Wasoko & MaxAB Finalize Post-Merger Operational Integration Across 5 Core Markets',
    deck: 'The combined entity reports positive unit economics in Cairo and Nairobi as route optimization and bulk procurement synergies take effect.',
    author: 'Michael Kimani',
    date: '18th Sep 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-yc-agents',
    startupId: 'wasoko-maxab',
  },
  {
    id: 'story-altschool-expansion',
    category: 'EdTech',
    title: 'AltSchool Africa Unveils Specialized AI Engineering & Data Operations Academies',
    deck: 'With over 40,000 learners trained to date, the vocational platform is expanding direct placement pipelines into European and North American tech teams.',
    author: 'Alexander Onukwue',
    date: '17th Sep 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-842',
    startupId: 'altschool',
  },
  {
    id: 'story-kasha-remedial',
    category: 'Femtech',
    title: 'Kasha Expands Digital Women’s Healthcare Supply Chains Into Francophone Central Africa',
    deck: 'Reaching 3 million customers across East Africa, the confidential healthcare access network is partnering with regional ministries to scale maternal health products.',
    author: 'Ngozi Chukwu',
    date: '16th Sep 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-842',
    startupId: 'kasha',
  },
  {
    id: 'story-ecosystem-h2',
    category: 'Ecosystem',
    title: 'African Tech Funding In 2026: Debt Financing Outpaces Venture Equity Amid Valuation Realism',
    deck: 'Founders prioritize capital efficiency, local currency debt syndicates, and positive cash flow over speculative multi-stage venture dilution.',
    author: 'Kenn Abuya',
    date: '15th Sep 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    articleId: 'dispatch-842',
    startupId: 'ile-ayaba',
  },
];

const CATEGORY_NAV_ITEMS = [
  'Acquisitions',
  'African Tech Roundup',
  'Agritech',
  'Climate',
  'Digest',
  'Ecommerce',
  'Ecosystem',
  'EdTech',
  'Femtech',
  'FinTech',
];

export const StartupsView: React.FC<StartupsViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
  onOpenContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [cmsStartups, setCmsStartups] = useState<PublicStartup[]>([]);

  useEffect(() => {
    let active = true;
    void getPublishedStartups().then((startups) => {
      if (active) setCmsStartups(startups);
    });
    return () => { active = false; };
  }, []);

  // Startup Profiles Carousel State
  const startupProfilesList = useMemo(() => Object.values(STARTUP_PROFILES), []);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Auto-advance interval (pauses on hover)
  useEffect(() => {
    if (isCarouselHovered || startupProfilesList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCarouselIndex((prev) => (prev + 1) % startupProfilesList.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isCarouselHovered, startupProfilesList.length]);

  // Valuation Calculator State
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calcArr, setCalcArr] = useState<number>(3.5);
  const [calcGrowth, setCalcGrowth] = useState<number>(140);
  const [calcSector, setCalcSector] = useState<'fintech' | 'agritech' | 'ai' | 'ecommerce'>('fintech');

  // Multiples calculation
  const calculatedValuation = useMemo(() => {
    let baseMultiple = 8;
    if (calcSector === 'ai') baseMultiple = 15;
    if (calcSector === 'fintech') baseMultiple = 10;
    if (calcSector === 'agritech') baseMultiple = 7;
    if (calcSector === 'ecommerce') baseMultiple = 5;

    // Growth booster
    const growthFactor = calcGrowth > 200 ? 1.5 : calcGrowth > 100 ? 1.25 : 1.0;
    const finalMultiple = baseMultiple * growthFactor;
    const valuation = calcArr * finalMultiple;
    return {
      multiple: finalMultiple.toFixed(1),
      valuation: valuation.toFixed(1),
    };
  }, [calcArr, calcGrowth, calcSector]);

  // Handle Share button
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Page link copied to clipboard!');
      setTimeout(() => setShareToast(null), 3000);
    } else {
      setShareToast('Sharing TechCabal / Nextake Startups Desk');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  // Filter editorial stories based on category & search
  const filteredStories = useMemo(() => {
    return EDITORIAL_STORIES.filter((story) => {
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'African Tech Roundup' && story.category !== 'Ecosystem') {
          return false;
        }
        if (selectedCategory === 'Digest' && story.category !== 'Startups') {
          return false;
        }
        if (story.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = story.title.toLowerCase().includes(q);
        const matchDeck = story.deck.toLowerCase().includes(q);
        const matchCategory = story.category.toLowerCase().includes(q);
        const matchAuthor = story.author.toLowerCase().includes(q);
        return matchTitle || matchDeck || matchCategory || matchAuthor;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Lead Top Story & Secondary Stack
  const topStory = useMemo(() => {
    return filteredStories.find((s) => s.isTopStory) || filteredStories[0] || EDITORIAL_STORIES[0];
  }, [filteredStories]);

  const secondaryStories = useMemo(() => {
    return filteredStories.filter((s) => s.id !== topStory.id).slice(0, 3);
  }, [filteredStories, topStory]);

  const moreEditorialFeed = useMemo(() => {
    const leadIds = new Set([topStory.id, ...secondaryStories.map((s) => s.id)]);
    return filteredStories.filter((s) => !leadIds.has(s.id));
  }, [filteredStories, topStory, secondaryStories]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-[#00c078] selection:text-black">
      {/* ========================================================================= */}
      {/* STARTUPS HEADER & CATEGORY NAVIGATION BAR (FROM REFERENCE UI) */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3 sm:pb-4">
          {/* Main Title: Startups */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1
              onClick={() => setSelectedCategory('All')}
              className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-black cursor-pointer hover:opacity-80 transition-opacity leading-none"
              title="Click to reset to All Startups"
            >
              Startups
            </h1>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-[#00c078] hover:underline font-bold"
              >
                Reset filter ({selectedCategory})
              </button>
            )}
          </div>

          {/* Navigation Bar Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Scrollable Category Links */}
            <div className="flex items-center overflow-x-auto no-scrollbar text-xs sm:text-[13.5px] py-1 font-medium">
              {CATEGORY_NAV_ITEMS.map((cat, idx) => {
                const isActive = selectedCategory === cat;
                return (
                  <React.Fragment key={cat}>
                    <button
                      onClick={() => setSelectedCategory((prev) => (prev === cat ? 'All' : cat))}
                      className={`whitespace-nowrap transition-colors py-1 ${
                        isActive
                          ? 'text-[#00c078] font-black'
                          : 'text-black hover:text-[#00c078]'
                      }`}
                    >
                      {cat}
                    </button>
                    {idx < CATEGORY_NAV_ITEMS.length - 1 && (
                      <span className="text-slate-300 font-light select-none mx-2 sm:mx-2.5">
                        |
                      </span>
                    )}
                  </React.Fragment>
                );
              })}

              {/* More Dropdown */}
              <span className="text-slate-300 font-light select-none mx-2 sm:mx-2.5">
                |
              </span>
              <div className="relative inline-block">
                <button
                  onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-1 text-black hover:text-[#00c078] whitespace-nowrap py-1 font-medium"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 text-black" />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-30 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-black flex items-center gap-2 font-medium"
                    >
                      <Award className="w-3.5 h-3.5 text-[#00c078]" />
                      <span>All Startups Desk</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('startup-article', 'paystack');
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-black flex items-center gap-2 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#00c078]" />
                      <span>Investment Briefs</span>
                    </button>
                    <button
                      onClick={() => {
                        setCalculatorOpen(true);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-black flex items-center gap-2 font-medium"
                    >
                      <Calculator className="w-3.5 h-3.5 text-[#00c078]" />
                      <span>Valuation Calculator</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory('FinTech');
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-black flex items-center gap-2 font-medium"
                    >
                      <span className="w-3.5 h-3.5 text-[#00c078] font-bold">₦</span>
                      <span>FinTech Spotlight</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Share Button (Far Right) */}
            <div className="relative shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-black text-xs sm:text-sm font-semibold transition-colors border border-slate-200"
              >
                <span>Share</span>
                <svg
                  className="w-3.5 h-3.5 fill-none stroke-current"
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 14 20 9 15 4" />
                  <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                </svg>
              </button>
              {shareToast && (
                <div className="absolute right-0 top-10 whitespace-nowrap bg-[#00c078] text-black text-[11px] font-bold px-3 py-1 rounded shadow-lg animate-in fade-in duration-150 z-30">
                  {shareToast}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {cmsStartups.length > 0 && (
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Company intelligence</p>
                <h2 className="mt-1 text-xl font-extrabold text-black">Latest startup profiles</h2>
              </div>
              <span className="text-xs text-slate-500">{cmsStartups.length} profiles</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cmsStartups.map((startup) => (
                <article key={startup.id} className="flex min-w-0 gap-3 border-t-2 border-emerald-600 bg-white p-4">
                  {startup.logoUrl ? <img src={startup.logoUrl} alt="" className="h-11 w-11 shrink-0 rounded object-cover" /> : null}
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-black">{startup.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-emerald-700">{startup.industry}{startup.stage ? ` · ${startup.stage}` : ''}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{startup.description || [startup.headquarters, startup.country].filter(Boolean).join(', ')}</p>
                    {startup.website && <a href={startup.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-black underline underline-offset-2">Company website</a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: DOMINANT LEAD STORY (Col-span 7) */}
          <div className="lg:col-span-7 flex flex-col group">
            <div
              onClick={() => onNavigate('startup-article', topStory.startupId || 'ile-ayaba')}
              className="cursor-pointer"
            >
              {/* Lead Image */}
              <div className="relative w-full aspect-16/10 rounded-xs overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={topStory.image}
                  alt={topStory.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Title & Metadata directly below the image */}
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#00c078]">
                  {topStory.category}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight group-hover:text-[#00c078] transition-colors">
                  {topStory.title}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                  {topStory.deck}
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1 font-sans">
                  <span className="text-slate-900 font-semibold">{topStory.author}</span>
                  <span>|</span>
                  <span>{topStory.date}</span>
                  <span>·</span>
                  <span>{topStory.readTime}</span>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => onToggleSave(topStory.id)}
                className={`flex items-center space-x-1.5 transition-colors ${
                  savedIds.includes(topStory.id) ? 'text-[#00c078] font-bold' : 'hover:text-black'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedIds.includes(topStory.id) ? 'Saved' : 'Save Story'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: STACKED SECONDARY FEATURES (Col-span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {secondaryStories.map((story, index) => (
              <div
                key={story.id}
                onClick={() => onNavigate('startup-article', story.startupId || 'ile-ayaba')}
                className="group cursor-pointer flex flex-col space-y-3 pb-6 border-b border-slate-200 last:border-b-0 last:pb-0"
              >
                {/* If first secondary item, show the featured thumbnail matching Capture.PNG */}
                {index === 0 && (
                  <div className="relative w-full aspect-16/9 rounded-xs overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00c078]">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-[#00c078] transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 pt-0.5">
                    <span className="text-slate-800 font-medium">{story.author}</span>
                    <span>|</span>
                    <span>{story.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3B. FEATURED STARTUP PROFILES & INVESTMENT BRIEFS (AUTO CAROUSEL) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#00c078] mb-1">
              <span>Investment Briefs & Company Profiles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
              Startup Due Diligence & Dossiers
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Standardized 14-section investment intelligence briefs covering unit economics, proprietary technology, funding history, and identifiable risks.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveCarouselIndex((prev) => (prev - 1 + startupProfilesList.length) % startupProfilesList.length)}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-black flex items-center justify-center text-slate-700 hover:text-black transition-colors bg-white shadow-xs"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveCarouselIndex((prev) => (prev + 1) % startupProfilesList.length)}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-black flex items-center justify-center text-slate-700 hover:text-black transition-colors bg-white shadow-xs"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container: Fitted to container size */}
        <div
          className="relative overflow-hidden py-2"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          {/* Sliding Track */}
          <div
            className="flex items-stretch transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] [--card-w:100%] sm:[--card-w:calc((100%-20px)/2)] lg:[--card-w:calc((100%-48px)/3)] [--card-gap:16px] sm:[--card-gap:20px] lg:[--card-gap:24px]"
            style={{
              gap: 'var(--card-gap)',
              transform: `translateX(calc(-1 * ${(startupProfilesList.length + activeCarouselIndex)} * (var(--card-w) + var(--card-gap))))`,
            }}
          >
            {[...startupProfilesList, ...startupProfilesList, ...startupProfilesList].map((prof, idx) => {
              const actualIndex = idx % startupProfilesList.length;
              const isActive = actualIndex === activeCarouselIndex;

              return (
                <div
                  key={`${prof.id}-${idx}`}
                  style={{ width: 'var(--card-w)' }}
                  onClick={() => {
                    onNavigate('startup-article', prof.id);
                  }}
                  className={`group relative shrink-0 cursor-pointer rounded-xl p-5 min-h-[300px] flex flex-col justify-between transition-all duration-300 select-none overflow-hidden ${
                    isActive
                      ? 'border-2 border-[#00c078] shadow-2xl ring-2 ring-[#00c078]/40 scale-[1.01] opacity-100 z-10'
                      : 'border border-white/20 opacity-90 hover:opacity-100 hover:border-white/50 shadow-md hover:shadow-xl'
                  }`}
                >
                  {/* Background Picture */}
                  {prof.featuredImage ? (
                    <img
                      src={prof.featuredImage}
                      alt={prof.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}

                  {/* Dark Gradient Overlay for Contrast & Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 pointer-events-none" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />

                  {/* Content Container (Layered above background) */}
                  <div className="relative z-10 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 overflow-hidden shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                          {prof.logo ? (
                            <img src={prof.logo} alt={prof.name} className="w-full h-full object-cover" />
                          ) : (
                            prof.name.charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-[#00e599] transition-colors leading-tight drop-shadow-xs truncate">
                            {prof.name}
                          </h3>
                          <div className="text-[11px] text-slate-300 truncate">{prof.headquarters}</div>
                        </div>
                      </div>
                      <span className="shrink-0 ml-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-white/15 backdrop-blur-md text-white border border-white/25 shadow-xs">
                        {prof.stage}
                      </span>
                    </div>

                    {/* One line summary */}
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed drop-shadow-xs">
                      {prof.oneLineDescription}
                    </p>

                    {/* Key Metrics Chips */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-xs">
                      <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-lg border border-white/15 shadow-xs">
                        <span className="text-[10px] text-slate-300 font-bold uppercase block">Funding Raised</span>
                        <span className="font-black text-white truncate block text-xs sm:text-sm">{prof.investmentSnapshot.fundingRaised}</span>
                      </div>
                      <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-lg border border-white/15 shadow-xs">
                        <span className="text-[10px] text-slate-300 font-bold uppercase block">Revenue</span>
                        <span className="font-black text-white truncate block text-xs sm:text-sm">{prof.investmentSnapshot.revenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action footer */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300 font-medium">Updated {prof.updatedDate}</span>
                    <span className="text-[#00e599] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 drop-shadow-xs">
                      <span>Open Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Progress Indicators / Dots */}
        <div className="flex items-center justify-center space-x-1.5 mt-4">
          {startupProfilesList.map((prof, idx) => {
            const isActive = idx === activeCarouselIndex;
            return (
              <button
                key={prof.id}
                onClick={() => setActiveCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-6 bg-[#00c078]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MORE IN STARTUPS: CATEGORY EDITORIAL STREAM */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#00c078] mb-1">
              Curated Dispatches
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
              {selectedCategory === 'All' ? 'Latest in Startups' : `${selectedCategory} Startups`}
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-600 font-medium">
              Showing {filteredStories.length} stories
            </span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-[#00c078] hover:underline font-semibold"
              >
                View All Categories
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {moreEditorialFeed.map((story) => (
            <article
              key={story.id}
              onClick={() => onNavigate('startup-article', story.startupId || 'ile-ayaba')}
              className="group cursor-pointer flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-4 hover:border-[#00c078] shadow-xs hover:shadow-md transition-all"
            >
              <div>
                <div className="relative w-full aspect-16/10 overflow-hidden rounded-xs bg-slate-100 border border-slate-100 mb-3">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#009e60] text-[10px] font-bold px-2 py-0.5 rounded border border-[#00c078]/30 shadow-xs flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" />
                    <span>Investment Brief</span>
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#00c078] mb-1">
                  {story.category}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-[#00c078] transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {story.deck}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-slate-800 font-medium">{story.author}</span>
                <span className="text-[#009e60] font-bold group-hover:underline flex items-center gap-1">
                  <span>View Brief</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE VALUATION MULTIPLE CALCULATOR MODAL / WIDGET */}
      {/* ========================================================================= */}
      {calculatorOpen && (
        <div
          onClick={() => setCalculatorOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl p-6 text-black space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#00c078]/15 text-[#00c078] flex items-center justify-center font-bold">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">Startup Valuation Calculator</h3>
                  <p className="text-xs text-slate-500">TechCabal venture multiple benchmarking engine</p>
                </div>
              </div>
              <button
                onClick={() => setCalculatorOpen(false)}
                className="text-slate-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-4 text-xs font-sans">
              {/* Sector selector */}
              <div>
                <label className="text-slate-700 font-bold block mb-1.5 uppercase tracking-wider text-[11px]">
                  Sector & Business Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'fintech', label: 'FinTech', mult: '10x' },
                    { id: 'agritech', label: 'Agritech', mult: '7x' },
                    { id: 'ai', label: 'AI & Data', mult: '15x' },
                    { id: 'ecommerce', label: 'B2B Commerce', mult: '5x' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCalcSector(s.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        calcSector === s.id
                          ? 'border-[#00c078] bg-[#00c078]/10 text-black font-bold ring-1 ring-[#00c078]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-bold">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Base: {s.mult}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Recurring Revenue Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    Current ARR / Run Rate
                  </span>
                  <span className="text-[#00c078] font-bold text-sm">${calcArr}M</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={25}
                  step={0.5}
                  value={calcArr}
                  onChange={(e) => setCalcArr(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00c078]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$500K</span>
                  <span>$10M</span>
                  <span>$25M+</span>
                </div>
              </div>

              {/* YoY Growth Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    YoY Growth Velocity
                  </span>
                  <span className="text-emerald-600 font-bold text-sm">+{calcGrowth}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={400}
                  step={10}
                  value={calcGrowth}
                  onChange={(e) => setCalcGrowth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>+20%</span>
                  <span>+150%</span>
                  <span>+400%</span>
                </div>
              </div>

              {/* Result Benchmark Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">
                    Implied Valuation Multiple
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {calculatedValuation.multiple}x ARR
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500">
                    Estimated Fair Valuation
                  </div>
                  <div className="text-2xl font-black text-[#00c078]">
                    ${calculatedValuation.valuation}M
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setCalculatorOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
