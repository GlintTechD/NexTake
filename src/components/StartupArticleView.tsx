import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import { STARTUP_PROFILES } from '../data/startupProfilesData';
import {
  Share2,
  Bookmark,
  Check,
  Link2,
  Linkedin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  TrendingUp,
  Globe,
  Layers,
  Cpu,
  Scale,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface StartupArticleViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds?: string[];
  onToggleSave: (id: string) => void;
  startupId?: string;
}

export const StartupArticleView: React.FC<StartupArticleViewProps> = ({
  onNavigate,
  savedIds = [],
  onToggleSave,
  startupId = 'paystack',
}) => {
  const [selectedId, setSelectedId] = useState<string>(startupId);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [isDossierExpanded, setIsDossierExpanded] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState<'brief' | 'product' | 'market' | 'diligence'>('brief');

  // Sync selectedId with prop changes
  useEffect(() => {
    if (startupId) {
      if (STARTUP_PROFILES[startupId]) {
        setSelectedId(startupId);
      } else {
        const found = Object.keys(STARTUP_PROFILES).find(
          (k) => k.includes(startupId) || startupId.includes(k)
        );
        if (found) {
          setSelectedId(found);
        }
      }
    }
  }, [startupId]);

  const profile = STARTUP_PROFILES[selectedId] || STARTUP_PROFILES['paystack'] || STARTUP_PROFILES['ile-ayaba'];
  const isSaved = savedIds.includes(profile.id);

  // Derived content fields with fallback to ensure ANY startup displays perfectly in this UI
  const headline =
    profile.articleHeadline ||
    `${profile.name} pushes deeper into Africa with new product suite for businesses`;

  const deck =
    profile.articleDeck ||
    profile.oneLineDescription ||
    `The ${profile.country} venture is scaling its operations to help enterprises across Africa accept payments, optimize logistics, and scale efficiently.`;

  const authorName = profile.author?.name || 'Next Take';
  const publishedDate = profile.publishedDate || '28 Sep 2026';
  const readTime = profile.readTime || '6 min read';

  const imageCaption =
    profile.imageCaption ||
    `${profile.name}'s expanded product suite aims to give African businesses more tools to manage payments and operations.`;

  const imageCredit = profile.imageCredit || `Source: ${profile.name} (illustrative image)`;

  const secondaryImage =
    profile.secondaryImage ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

  const secondaryImageCaption =
    profile.secondaryImageCaption ||
    `${profile.headquarters}, a vibrant hub of African technology innovation, venture funding, and market expansion.`;

  const secondaryImageCredit =
    profile.secondaryImageCredit || 'Source: NexTake Intelligence Photo Dispatch';

  const theInterestingTake =
    profile.theInterestingTake ||
    `While many companies in this sector focus on basic transactions alone, ${profile.name}'s bet is that businesses need more than just point solutions. By building a broader ecosystem, the company is positioning itself as a long-term infrastructure partner — not just a vendor.`;

  const whatCompanyDoes =
    profile.whatCompanyDoesSummary ||
    profile.investmentBrief?.whatCompanyDoes ||
    `${profile.name} provides tailored technological infrastructure and digital solutions for African businesses, helping them streamline core operations, accept payments, and scale systematically across regional markets.`;

  const quote = profile.quote || {
    text: `“Our goal is to make it easier for African businesses to build, grow and compete globally by giving them the financial tools they need.”`,
    author: profile.name,
  };

  const whyThisMatters =
    profile.whyThisMatters ||
    `The expansion of ${profile.name}'s platform comes as African businesses continue to adopt digital tools to compete in a globalized economy. With more integrated solutions, the company could strengthen its position as a key player in the ecosystem, while creating lasting operating leverage and customer loyalty.`;

  const relatedStories = profile.relatedStories || [
    {
      id: 'fintech-rise',
      title: 'The rise of African fintechs and what it means for global markets',
      date: '12 Aug 2026',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'future-payments',
      title: 'How Paystack is building the future of payments in Africa',
      date: '3 Jun 2026',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'startups-watch',
      title: 'African startups to watch in 2026',
      date: '20 Jan 2026',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Link copied to clipboard!');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${headline} via @NexTake_Tech`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00c078] selection:text-slate-950 pb-24">
      {/* ========================================================================= */}
      {/* 1. TOP SUB-NAV BAR (BACK TO STARTUPS & QUICK COMPANY SWITCHER) */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-end gap-4">
          {/* Quick profile switcher */}
          <div className="flex items-center space-x-1.5 text-xs overflow-x-auto no-scrollbar py-0.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Featured:</span>
            {Object.values(STARTUP_PROFILES).slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  window.history.pushState({}, '', `/startup/${item.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedId === item.id
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN EDITORIAL ARTICLE & SIDEBAR LAYOUT */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: MAIN ARTICLE (COL-SPAN 8) */}
          {/* ===================================================================== */}
          <article className="lg:col-span-8">
            {/* Category kicker */}
            <div className="mb-2">
              <span className="text-blue-600 font-extrabold text-xs uppercase tracking-wider font-mono">
                STARTUPS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-3.5">
              {headline}
            </h1>

            {/* Deck / Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              {deck}
            </p>

            {/* Author Byline & Social Actions Bar */}
            <div className="flex flex-wrap items-center justify-between py-3 border-y border-slate-200 gap-4 mb-6">
              {/* Left Byline */}
              <div className="flex items-center space-x-3">
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-slate-900">By {authorName}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-slate-500">{publishedDate}</span>
                  <span className="text-slate-400 mx-2">·</span>
                  <span className="text-slate-500">{readTime}</span>
                </div>
              </div>

              {/* Right Social & Save Actions */}
              <div className="flex items-center space-x-2 text-slate-500">
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
                  title="Copy link"
                  aria-label="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleShareTwitter}
                  className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  title="Share on X"
                  aria-label="Share on X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={handleShareLinkedIn}
                  className="p-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  title="Share on LinkedIn"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>

                {/* Bookmark / Save */}
                <button
                  onClick={() => onToggleSave(profile.id)}
                  className={`p-1.5 rounded-md transition-colors ${
                    isSaved
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isSaved ? 'Saved in Radar' : 'Save story'}
                  aria-label="Save story"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Share Toast */}
            {shareToast && (
              <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xl z-50 flex items-center space-x-2 animate-in fade-in duration-200">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{shareToast}</span>
              </div>
            )}

            {/* Featured Image */}
            <div className="my-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-16/10 bg-slate-100">
                <img
                  src={profile.featuredImage}
                  alt={headline}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-normal">
                {imageCaption}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {imageCredit}
              </p>
            </div>

            {/* Editorial Body */}
            <div className="space-y-6 text-slate-800 text-[16px] sm:text-[17px] leading-[1.75]">
              {/* Intro paragraph */}
              <p>
                {profile.name}, the {profile.country} {profile.industry.toLowerCase()} company, is taking its next big step in its mission to power Africa's digital economy. The company recently announced an expanded product suite designed to help businesses across the continent accept payments, manage operations and grow with greater ease. The move comes at a time when African businesses are increasingly looking for integrated, reliable and locally relevant financial tools.
              </p>

              {/* H2: The interesting take */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">
                  The interesting take
                </h2>
                <p>
                  {theInterestingTake}
                </p>
              </div>

              {/* H2: What the company does */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">
                  What the company does
                </h2>
                <p>
                  {whatCompanyDoes}
                </p>
              </div>

              {/* Callout Quote Block (Soft Mint with quotation mark) */}
              <div className="bg-[#eefbf6] rounded-xl p-6 sm:p-8 my-8 border-l-4 border-[#00c078] relative">
                <span className="text-[#00c078] text-4xl sm:text-5xl font-serif leading-none select-none block mb-2">
                  “
                </span>
                <blockquote className="text-slate-800 font-medium text-lg sm:text-xl leading-relaxed italic">
                  {quote.text}
                </blockquote>
                <div className="text-slate-600 text-sm font-semibold mt-3">
                  — {quote.author}
                </div>
              </div>

              {/* H2: Why this matters */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-3">
                  Why this matters
                </h2>
                <p>
                  {whyThisMatters}
                </p>
              </div>

              {/* Secondary Featured Image */}
              <div className="my-8">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-16/10 bg-slate-100">
                  <img
                    src={secondaryImage}
                    alt="Ecosystem and Market Context"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2.5 leading-normal">
                  {secondaryImageCaption}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {secondaryImageCredit}
                </p>
              </div>
            </div>

            {/* =================================================================== */}
            {/* OPTIONAL DEEP DIVE: EXPANDABLE VENTURE INTELLIGENCE DOSSIER */}
            {/* =================================================================== */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <button
                onClick={() => setIsDossierExpanded((prev) => !prev)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between text-left transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                    {isDossierExpanded ? 'Collapse' : 'Explore'} Full Venture Intelligence Dossier
                  </h3>
                  <p className="text-xs text-slate-500">
                    Access verified architecture, market TAM calculations, due diligence questions, and risk registry.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
                  {isDossierExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isDossierExpanded && (
                <div className="mt-6 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                  {/* Sub tabs */}
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar text-xs">
                    <button
                      onClick={() => setActiveDossierTab('brief')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeDossierTab === 'brief'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100'
                      }`}
                    >
                      Problem & Solution
                    </button>
                    <button
                      onClick={() => setActiveDossierTab('product')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeDossierTab === 'product'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100'
                      }`}
                    >
                      Products & Model
                    </button>
                    <button
                      onClick={() => setActiveDossierTab('market')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeDossierTab === 'market'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100'
                      }`}
                    >
                      Market Opportunity
                    </button>
                    <button
                      onClick={() => setActiveDossierTab('diligence')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        activeDossierTab === 'diligence'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100'
                      }`}
                    >
                      Due Diligence & Risks
                    </button>
                  </div>

                  {/* Tab 1: Brief */}
                  {activeDossierTab === 'brief' && (
                    <div className="space-y-4 text-xs sm:text-sm">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-600 mb-1">
                          Problem Solved
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {profile.investmentBrief?.problemSolved}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-600 mb-1">
                          Proprietary Solution
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {profile.investmentBrief?.solution}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-1">
                          Key Traction Signals
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                          {profile.investmentBrief?.growthTractionSignals?.map((sig, idx) => (
                            <li key={idx}>{sig}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Products */}
                  {activeDossierTab === 'product' && (
                    <div className="space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {profile.companyAndProduct?.productsAndServices?.map((prod, idx) => (
                          <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                            <span className="text-[10px] font-bold text-blue-600 uppercase">
                              {prod.tierOrCategory}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs mt-1">
                              {prod.name}
                            </h5>
                            <p className="text-slate-600 text-xs mt-1 leading-normal">
                              {prod.description}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-1">
                          Business Model & Monetization
                        </h4>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {profile.companyAndProduct?.businessModel}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Market */}
                  {activeDossierTab === 'market' && (
                    <div className="space-y-4 text-xs sm:text-sm">
                      <p className="text-slate-700 leading-relaxed">
                        {profile.marketOpportunity?.targetMarket}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {profile.marketOpportunity?.marketSizeData?.map((item, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500">{item.metric}</div>
                            <div className="text-base font-extrabold text-slate-900 mt-0.5">
                              {item.value}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Source: {item.source} ({item.sourceDate})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Diligence */}
                  {activeDossierTab === 'diligence' && (
                    <div className="space-y-4 text-xs sm:text-sm">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-amber-700 mb-2">
                          Key Risk Factors & Challenges
                        </h4>
                        <div className="space-y-2">
                          {profile.risksAndChallenges?.map((risk, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                              <span className="text-[10px] font-bold text-amber-800 uppercase">
                                {risk.category} · {risk.nature}
                              </span>
                              <div className="font-bold text-slate-900 text-xs mt-0.5">
                                {risk.title}
                              </div>
                              <p className="text-xs text-slate-700 mt-1">
                                {risk.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-700 mb-2">
                          Critical Investor Diligence Inquiries
                        </h4>
                        <div className="space-y-2">
                          {profile.investorDueDiligenceQuestions?.map((q, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                              <div className="text-[10px] font-bold text-blue-600 uppercase">
                                {q.theme}
                              </div>
                              <div className="font-semibold text-slate-900 text-xs mt-0.5">
                                {q.question}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Context: {q.context}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: SIDEBAR METRICS & CARDS (COL-SPAN 4) */}
          {/* ===================================================================== */}
          <aside className="lg:col-span-4 space-y-6">
            {/* ----------------------------------------------------------------- */}
            {/* CARD 1: STARTUP AT A GLANCE */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Startup at a glance
              </h3>

              {/* Logo & Name Header */}
              <div className="flex items-center space-x-3 mb-3">
                {profile.id === 'paystack' ? (
                  /* Paystack Custom Signature Logo with 3 Horizontal Stripes */
                  <div className="w-10 h-10 rounded-lg bg-[#001f3f] flex flex-col justify-center items-start px-2.5 space-y-1 shrink-0 shadow-xs">
                    <div className="w-4 h-1 bg-[#00c078] rounded-full"></div>
                    <div className="w-5 h-1 bg-[#00c078] rounded-full"></div>
                    <div className="w-3 h-1 bg-[#00c078] rounded-full"></div>
                  </div>
                ) : profile.logo ? (
                  <img
                    src={profile.logo}
                    alt={profile.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                    {profile.name[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {profile.name}
                  </h4>
                </div>
              </div>

              {/* One line summary */}
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {profile.oneLineDescription}
              </p>

              {/* Key Value Metadata Table */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Founded</span>
                  <span className="font-medium text-slate-900">{profile.foundedYear}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-medium text-slate-900">{profile.headquarters}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-medium text-slate-900">{profile.industry}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Stage</span>
                  <span className="font-medium text-slate-900">{profile.stage}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Funding</span>
                  <span className="font-medium text-slate-900">{profile.investmentSnapshot.fundingRaised}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Employees</span>
                  <span className="font-medium text-slate-900">{profile.investmentSnapshot.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Revenue</span>
                  <span className="font-medium text-slate-900">{profile.investmentSnapshot.revenue}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Valuation</span>
                  <span className="font-medium text-slate-900">{profile.investmentSnapshot.valuation}</span>
                </div>
              </div>

              {/* Website Link Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 2: FUNDING HISTORY */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Funding history
              </h3>

              {/* Vertical timeline */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {profile.fundingHistory?.rounds?.map((round, idx) => (
                  <div key={idx} className="relative">
                    {/* Blue timeline node */}
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="text-xs">
                      <div className="flex items-center space-x-2 font-bold text-slate-900">
                        <span className="text-slate-500 font-semibold">{round.date}</span>
                        <span>{round.round}</span>
                        <span className="text-slate-900">{round.amount}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Lead: <span className="text-slate-700 font-medium">{round.leadInvestor}</span>
                      </div>
                      {round.otherKnownInvestors && round.otherKnownInvestors.length > 0 && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Other: {round.otherKnownInvestors.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total funding summary footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
                Total funding: {profile.fundingHistory?.totalFundingDisclosed}
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 3: FOUNDERS & LEADERSHIP */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Founders & leadership
              </h3>

              <div className="space-y-4">
                {profile.foundersAndLeadership?.map((leader, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <img
                      src={leader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={leader.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="text-xs min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {leader.name}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {leader.role}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {leader.background}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 4: RECENT DEVELOPMENTS */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Recent developments
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {profile.recentDevelopments?.slice(0, 3).map((dev, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-500 text-[11px]">
                        {dev.date}
                      </span>
                      <div className="font-medium text-slate-900 mt-0.5 leading-snug">
                        {dev.headline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View all button */}
              <button
                onClick={() => setIsDossierExpanded(true)}
                className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center space-x-1 mt-4 group"
              >
                <span>View all</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 5: RELATED STORIES */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Related stories
              </h3>

              <div className="space-y-4">
                {relatedStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => onNavigate('startups')}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {story.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {story.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CARD 6: SOURCES & ATTRIBUTIONS */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Sources
                </h3>
                <span className="text-xs text-slate-400 font-mono select-none">
                  ⇄
                </span>
              </div>

              <div className="space-y-3">
                {profile.sourcesAndAttributions?.map((src, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {src.sourceName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {src.sourceName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {src.publicationDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
