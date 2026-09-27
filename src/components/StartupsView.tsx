import React, { useState, useMemo } from 'react';
import { ScreenView, Startup } from '../types';
import { STARTUPS_LIST, STARTUP_MARKET_INDICATORS } from '../data/startupsData';
import {
  Rocket,
  TrendingUp,
  Sparkles,
  Flame,
  Award,
  Search,
  Filter,
  ArrowUpRight,
  Bookmark,
  Check,
  Shield,
  Zap,
  Building2,
  DollarSign,
  BarChart3,
  Users,
  Compass,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ChevronRight,
  Cpu,
  Layers,
} from 'lucide-react';

interface StartupsViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenContact?: () => void;
}

type TabType = 'all' | 'trending' | 'unicorn' | 'investment';

export const StartupsView: React.FC<StartupsViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
  onOpenContact,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'unicorn' | 'investment' | 'arr' | 'valuation'>('unicorn');
  const [selectedStartupForModal, setSelectedStartupForModal] = useState<Startup | null>(null);
  const [contactSuccessMessage, setContactSuccessMessage] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    STARTUPS_LIST.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredStartups = useMemo(() => {
    return STARTUPS_LIST.filter((startup) => {
      // Tab filter
      if (activeTab === 'trending' && !startup.isTrending) return false;
      if (activeTab === 'unicorn' && !startup.isLikelyToUnicorn) return false;
      if (activeTab === 'investment' && !startup.isLikelyToInvest) return false;

      // Category filter
      if (selectedCategory !== 'All' && startup.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = startup.name.toLowerCase().includes(q);
        const matchesTicker = startup.ticker.toLowerCase().includes(q);
        const matchesTagline = startup.tagline.toLowerCase().includes(q);
        const matchesCategory = startup.category.toLowerCase().includes(q);
        const matchesFounders = startup.founders.some(
          (f) => f.name.toLowerCase().includes(q) || f.pedigree.toLowerCase().includes(q)
        );
        const matchesInvestors = startup.keyInvestors.some((inv) =>
          inv.toLowerCase().includes(q)
        );
        const matchesTech = startup.techStack.some((t) => t.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesTicker &&
          !matchesTagline &&
          !matchesCategory &&
          !matchesFounders &&
          !matchesInvestors &&
          !matchesTech
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'unicorn') {
        return b.unicornProbability - a.unicornProbability;
      }
      if (sortBy === 'investment') {
        const scoreRank: Record<string, number> = { AAA: 4, 'AA+': 3, AA: 2, 'A+': 1 };
        return (scoreRank[b.investmentScore] || 0) - (scoreRank[a.investmentScore] || 0);
      }
      if (sortBy === 'arr') {
        const parseArr = (str: string) => parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
        return parseArr(b.arr) - parseArr(a.arr);
      }
      if (sortBy === 'valuation') {
        const parseVal = (str: string) => parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
        return parseVal(b.valuation) - parseVal(a.valuation);
      }
      return 0;
    });
  }, [activeTab, selectedCategory, searchQuery, sortBy]);

  // Spotlight leaders
  const topUnicornLeader = useMemo(() => {
    return [...STARTUPS_LIST].sort((a, b) => b.unicornProbability - a.unicornProbability)[0];
  }, []);

  const topInvestmentPick = useMemo(() => {
    return STARTUPS_LIST.find((s) => s.investmentScore === 'AAA' && s.stage === 'Seed') || STARTUPS_LIST[0];
  }, []);

  const topTrendingBreakout = useMemo(() => {
    return STARTUPS_LIST.find((s) => s.isTrending && s.category === 'AI & Agents') || STARTUPS_LIST[0];
  }, []);

  return (
    <div className="bg-[#fafbfc] min-h-screen text-slate-900 pb-28">
      {/* ========================================================================= */}
      {/* 1. TOP MARKET INTELLIGENCE TERMINAL BAR */}
      {/* ========================================================================= */}
      <section className="bg-[#070b10] border-b border-[#1b2636] text-white pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4.5"></span>
              <span className="text-emerald-400 font-bold tracking-wider uppercase">
                NexTake Venture Intelligence // Private Market Desk
              </span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-slate-400">
              <span>Coverage: Q3-Q4 2026</span>
              <span>•</span>
              <span>Updated: Real-time Telemetry</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Venture & Startup Radar
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-sans">
                Real-time technical due diligence, predictive unicorn trajectory models, and capital efficiency indexes across frontier technology ventures.
              </p>
            </div>

            {/* Macro Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 bg-[#0d1420] border border-slate-800 rounded-xl p-3 sm:p-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Unicorn Index</div>
                <div className="text-base sm:text-lg font-black text-emerald-400 font-mono flex items-center gap-1">
                  {STARTUP_MARKET_INDICATORS.unicornPipelineIndex}
                  <span className="text-[10px] text-emerald-500 font-normal">({STARTUP_MARKET_INDICATORS.unicornPipelineChange})</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Deal Flow TAM</div>
                <div className="text-base sm:text-lg font-black text-white font-mono">
                  {STARTUP_MARKET_INDICATORS.totalDealFlowVolume}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Avg Growth YoY</div>
                <div className="text-base sm:text-lg font-black text-cyan-400 font-mono">
                  {STARTUP_MARKET_INDICATORS.avgArrGrowth}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Capital Efficiency</div>
                <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                  {STARTUP_MARKET_INDICATORS.capitalEfficiencyAvg}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPOTLIGHT PODIUM / HERO HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Spotlight 1: #1 Most Likely to Unicorn */}
          <div
            onClick={() => setSelectedStartupForModal(topUnicornLeader)}
            className="group cursor-pointer bg-white rounded-xl border-2 border-emerald-500/60 p-5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-black font-mono px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow">
              <span>🦄 #1 Unicorn Trajectory</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 font-bold mb-1">
                <span>{topUnicornLeader.ticker}</span>
                <span>•</span>
                <span>{topUnicornLeader.category}</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                {topUnicornLeader.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {topUnicornLeader.tagline}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Unicorn Probability</span>
                <span className="text-emerald-700 font-black text-base">{topUnicornLeader.unicornProbability}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Valuation</span>
                <span className="text-slate-900 font-black text-sm">{topUnicornLeader.valuation}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">ARR Run-rate</span>
                <span className="text-slate-900 font-black text-sm">{topUnicornLeader.arr}</span>
              </div>
            </div>
          </div>

          {/* Spotlight 2: #1 Top Investment Pick */}
          <div
            onClick={() => setSelectedStartupForModal(topInvestmentPick)}
            className="group cursor-pointer bg-white rounded-xl border-2 border-amber-500/60 p-5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[10px] font-black font-mono px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow">
              <span>💎 Top Seed Pick (AAA)</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-700 font-bold mb-1">
                <span>{topInvestmentPick.ticker}</span>
                <span>•</span>
                <span>{topInvestmentPick.category}</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 group-hover:text-amber-700 transition-colors">
                {topInvestmentPick.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {topInvestmentPick.tagline}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Investment Conviction</span>
                <span className="text-amber-600 font-black text-base">{topInvestmentPick.investmentScore} Grade</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Growth YoY</span>
                <span className="text-emerald-700 font-black text-sm">{topInvestmentPick.growthYoY}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Burn Multiple</span>
                <span className="text-slate-900 font-black text-sm">{topInvestmentPick.burnMultiple}</span>
              </div>
            </div>
          </div>

          {/* Spotlight 3: #1 Viral Trending Breakout */}
          <div
            onClick={() => setSelectedStartupForModal(topTrendingBreakout)}
            className="group cursor-pointer bg-white rounded-xl border-2 border-cyan-500/60 p-5 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 bg-cyan-400 text-slate-950 text-[10px] font-black font-mono px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow">
              <span>🔥 #1 Trending Breakout</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-700 font-bold mb-1">
                <span>{topTrendingBreakout.ticker}</span>
                <span>•</span>
                <span>{topTrendingBreakout.category}</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 group-hover:text-cyan-700 transition-colors">
                {topTrendingBreakout.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {topTrendingBreakout.tagline}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Stage / Round</span>
                <span className="text-cyan-700 font-black text-base">{topTrendingBreakout.stage}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Net Retention (NRR)</span>
                <span className="text-slate-900 font-black text-sm">{topTrendingBreakout.nrr}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Runway</span>
                <span className="text-slate-900 font-black text-sm">{topTrendingBreakout.runway}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CONTROLS, TABS & FILTERS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          {/* Main Primary View Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>All Startups ({STARTUPS_LIST.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'trending'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Trending Startups</span>
              </button>

              <button
                onClick={() => setActiveTab('unicorn')}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'unicorn'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Most Likely to Unicorn ($1B+)</span>
              </button>

              <button
                onClick={() => setActiveTab('investment')}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'investment'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Most Likely to Investment (Top Conviction)</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort startups by metric"
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="unicorn">Unicorn Probability %</option>
                <option value="investment">Investment Grade (AAA)</option>
                <option value="arr">ARR Velocity</option>
                <option value="valuation">Current Valuation</option>
              </select>
            </div>
          </div>

          {/* Search and Category Filter Pills */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search startups, founders, tech or investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sector Tags Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN STARTUP DOSSIER GRID */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredStartups.length}</span> verified ventures matching criteria
          </div>
          {activeTab !== 'all' && (
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-mono text-emerald-700 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredStartups.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 font-mono">No startups match filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query, sector pill, or selected view tab.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-mono font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStartups.map((startup) => {
              const isSaved = savedIds.includes(startup.id);

              return (
                <div
                  key={startup.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between relative group"
                >
                  {/* Top Bar inside card */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-white">
                            {startup.ticker}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700">
                            {startup.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                            {startup.stage}
                          </span>

                          {startup.isTrending && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 flex items-center gap-1">
                              <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                              Trending
                            </span>
                          )}

                          {startup.isLikelyToUnicorn && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              {startup.unicornProbability}% Unicorn Odds
                            </span>
                          )}

                          {startup.isLikelyToInvest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-600" />
                              {startup.investmentScore} Conviction
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight group-hover:text-emerald-700 transition-colors">
                          {startup.name}
                        </h2>
                      </div>

                      {/* Save to radar bookmark */}
                      <button
                        onClick={() => onToggleSave(startup.id)}
                        title={isSaved ? 'Remove from saved' : 'Save to radar'}
                        className={`p-2 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-50 text-slate-400 hover:text-slate-800 border-slate-200'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-sans mt-2.5 leading-relaxed">
                      {startup.tagline}
                    </p>

                    {/* Operational Telemetry Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f8fafc] border border-slate-100 rounded-xl p-3 mt-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Valuation</span>
                        <span className="font-bold text-slate-900 text-sm">{startup.valuation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">ARR / Growth</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          {startup.arr} <span className="text-[11px] font-normal text-emerald-600">({startup.growthYoY})</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Burn Multiple</span>
                        <span className="font-bold text-slate-900 text-sm">{startup.burnMultiple}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Net Retention</span>
                        <span className="font-bold text-cyan-700 text-sm">{startup.nrr}</span>
                      </div>
                    </div>

                    {/* Key Technical Moat Brief */}
                    <div className="mt-3.5 text-xs text-slate-600 bg-emerald-50/40 border border-emerald-200/50 rounded-lg p-2.5">
                      <span className="font-bold text-emerald-950 font-mono block mb-0.5">Defensible Moat:</span>
                      <p className="line-clamp-2 leading-relaxed">{startup.moat}</p>
                    </div>

                    {/* Founders & Investors Strip */}
                    <div className="mt-3.5 space-y-1.5 text-xs font-mono text-slate-500">
                      <div>
                        <span className="font-bold text-slate-700">Founders:</span>{' '}
                        {startup.founders.map((f) => f.name).join(', ')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Key Backers:</span>{' '}
                        {startup.keyInvestors.join(' • ')}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-slate-400">
                      HQ: {startup.hq} • Est. {startup.founded}
                    </div>

                    <button
                      onClick={() => setSelectedStartupForModal(startup)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-1.5 shadow"
                    >
                      <span>Investment Brief</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. STARTUP INVESTMENT DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedStartupForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#070b10] text-white p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">
                    {selectedStartupForModal.ticker}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{selectedStartupForModal.category}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{selectedStartupForModal.stage}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedStartupForModal.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1">
                  {selectedStartupForModal.tagline}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedStartupForModal(null);
                  setContactSuccessMessage(false);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
              {/* Telemetry Highlight Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] border border-slate-200 rounded-xl p-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Unicorn Probability</span>
                  <span className="text-lg font-black text-emerald-700">
                    {selectedStartupForModal.unicornProbability}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Investment Conviction</span>
                  <span className="text-lg font-black text-amber-600">
                    {selectedStartupForModal.investmentScore} Grade
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Valuation / Raised</span>
                  <span className="text-slate-900 font-bold">
                    {selectedStartupForModal.valuation} / {selectedStartupForModal.totalRaised}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">ARR Run-rate</span>
                  <span className="text-slate-900 font-bold">
                    {selectedStartupForModal.arr} ({selectedStartupForModal.growthYoY})
                  </span>
                </div>
              </div>

              {/* Executive Thesis */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Executive Investment Thesis
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 leading-relaxed font-sans text-sm">
                  {selectedStartupForModal.thesis}
                </div>
              </div>

              {/* Defensible Moat */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Monopolistic Moat & IP Barriers
                </h4>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-emerald-950 leading-relaxed font-sans text-sm">
                  {selectedStartupForModal.moat}
                </div>
              </div>

              {/* Key Traction Milestones */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Verified Production Milestones
                </h4>
                <ul className="space-y-2 text-xs font-mono text-slate-700">
                  {selectedStartupForModal.milestones.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Founders & Engineering Team */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Founding Pedigree
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {selectedStartupForModal.founders.map((founder, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="font-bold text-slate-900">{founder.name}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mb-1">{founder.role}</div>
                      <div className="text-[11px] text-slate-600 font-sans">{founder.pedigree}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Risk Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Core Technical Architecture
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStartupForModal.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Risk Assessment & Hedging
                  </h4>
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs font-sans">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-amber-800 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Critical Risk Vector:</span>
                    </div>
                    {selectedStartupForModal.riskFactor}
                  </div>
                </div>
              </div>

              {/* Backers & Market Size */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block">Total Addressable Market:</span>
                  <span className="font-bold text-slate-800">{selectedStartupForModal.marketSize}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lead Investors:</span>
                  <span className="font-bold text-slate-800">{selectedStartupForModal.keyInvestors.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-[#f8fafc] border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleSave(selectedStartupForModal.id)}
                  className={`px-3.5 py-2 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors ${
                    savedIds.includes(selectedStartupForModal.id)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedIds.includes(selectedStartupForModal.id) ? 'Saved to Radar' : 'Save to Radar'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {contactSuccessMessage ? (
                  <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Request dispatched to Bureau
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (onOpenContact) {
                        onOpenContact();
                      } else {
                        setContactSuccessMessage(true);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold tracking-wider transition-all shadow"
                  >
                    Request Partner Introduction
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
