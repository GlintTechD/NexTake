import React, { useEffect, useState } from 'react';
import { ScreenView } from '../types';
import { FEATURED_ARTICLE, getArticleById } from '../data/mockData';
import { getPublishedArticleById } from '../lib/articles';
import { isSupabaseConfigured } from '../lib/supabase';
import { adaptPublishedArticle } from '../lib/articleAdapter';
import { recordArticleOpen } from '../lib/visitorProfile';
import {
  Bookmark,
  Share2,
  ArrowRight,
  Zap,
  Play,
  ArrowUp,
  ShieldCheck,
  Check,
  Plus,
  Lock,
} from 'lucide-react';

interface ArticleViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  articleId?: string;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
  articleId,
}) => {
  const [article, setArticle] = useState(() => getArticleById(articleId));
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    setArticle(getArticleById(articleId));
    if (!isSupabaseConfigured || !articleId) return;

    getPublishedArticleById(articleId)
      .then((record) => {
        if (record) setArticle(adaptPublishedArticle(record));
      })
      .catch((error) => console.error('Failed to load published article:', error));
  }, [articleId]);

  useEffect(() => {
    if (articleId) recordArticleOpen(articleId, [article.category]);
  }, [articleId, article.category]);

  const isSaved = savedIds.includes(article.id);

  const toggleFollow = (name: string) => {
    setFollowingMap((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-24">
      {/* Article Container */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Header Breadcrumb / Classification */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>• {article.category} • {article.dispatchTag}</span>
          </div>
          <div className="text-slate-500 flex items-center space-x-2">
            <span style={{ fontFamily: "var(--font-mono, 'Inter', sans-serif)" }}>Peer verified</span>
            <span>•</span>
            <span style={{ fontFamily: "var(--font-mono, 'Inter', sans-serif)" }}>Archival grade</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="pt-6 pb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.12] mb-5">
            {article.title}
          </h1>

          <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-4xl">
            {article.subtitle}
          </p>
        </div>

        {/* Author Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 mb-8">
          <div className="flex items-center space-x-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-300"
            />
            <div>
              <div className="text-xs font-mono font-bold text-slate-900">
                {article.author.name}, {article.author.role}
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {article.date} • {article.updatedAgo} • {article.readTime}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleSave(article.id)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-950 text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? 'Saved' : 'Save story'}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Monograph URL copied to telemetry buffer.');
              }}
              className="p-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-600"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Silicon Image with Telemetry HUD Overlay */}
        <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mb-8 shadow-lg">
          <div className="relative aspect-video sm:aspect-[21/9]">
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

            {/* Bottom HUD Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-300 gap-1">
              <span className="text-emerald-400 truncate max-w-[70%]">
                {article.heroAperture}
              </span>
              <span className="text-slate-400 shrink-0">
                Confidential • Aperture resolution: 0.12Å
              </span>
            </div>
          </div>
        </div>

        {/* WHAT SHOULD I KNOW? [EXECUTIVE SYNTHESIS] Box */}
        <div className="rounded-xl border-2 border-[#00f2aa]/70 bg-gradient-to-br from-emerald-50/50 to-cyan-50/30 p-6 sm:p-8 mb-12 relative shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-emerald-500/20">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-emerald-900 tracking-wider">
              <span>What should I know?</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-300">
                Executive synthesis
              </span>
            </div>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
            {article.executivePoints.map((pt) => (
              <div key={pt.num} className="space-y-1">
                <div className="flex items-center space-x-2 font-mono text-xs font-bold text-slate-900">
                  <span className="text-emerald-700">{pt.num}.</span>
                  <span>{pt.title}:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Column Prose + Telemetry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Prose (8 cols) */}
          <div className="lg:col-span-8 space-y-8 text-slate-800 font-editorial text-lg leading-[1.8]">
            <p>
              For the past forty-eight months, foundational artificial intelligence has lived beneath the tyranny of autoregressive emission. Models predict sequentially, step by token, incapable of reconsidering an invalid premise once output registers in user-space.
            </p>

            <p>
              Today\'s joint disclosure between Anthropic and Google DeepMind fundamentally ruptures that architecture. Code-named <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 text-slate-900 font-bold">Project Scribe-IX</span>, the collaborative framework incorporates a decoupled speculative sandbox that evaluates semantic hypotheses against formal mathematical proofs before committing to token emission.
            </p>

            {/* Section 01 */}
            <div className="pt-6 font-sans">
              <div className="text-xs font-mono text-slate-400 tracking-wider font-bold mb-1">
                Sub-protocol analysis
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 font-sans mb-4">
                01 / The Simulation Pre-Pass Mechanism
              </h2>

              <p className="font-editorial text-lg text-slate-800 leading-[1.8] mb-6">
                Rather than streaming inferences directly from raw weight activations, the synthesizer executes an internal simulation pass across eight independent tensor sub-threads. When a reasoning conflict emerges—such as an invalid memory access or a logical mathematical non-sequitur—the sub-thread evaluates the edge case within an isolated execution sandbox.
              </p>

              {/* Quotation Box */}
              <div className="my-8 p-6 rounded-lg bg-[#f1f5f9] border-l-4 border-emerald-500 font-sans">
                <blockquote className="text-base sm:text-lg font-medium italic text-slate-900 leading-relaxed mb-3">
                  "We are no longer training models to predict the next token; we are training them to verify their own hypothesis before emitting reality."
                </blockquote>
                <div className="text-xs font-mono text-slate-500 font-bold tracking-wider">
                  — Dr. Dario Amodei, Co-founder & CEO, Anthropic
                </div>
              </div>

              {/* Vertical Brief / Short Embed Banner */}
              <div className="my-8 rounded-xl bg-[#090d14] text-white p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <div className="flex items-center space-x-4">
                  <div
                    onClick={() => onNavigate('shorts')}
                    className="w-16 h-20 rounded bg-slate-800 overflow-hidden relative group cursor-pointer shrink-0 border border-slate-700"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&q=80"
                      alt="Short Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">
                      • The 60-second edit • Vertical brief
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                      How Autonomous Synthesizers Run 1M In-Flight Proofs
                    </h3>
                    <p className="text-xs text-slate-400">
                      A high-velocity visual breakdown of dynamic graph speculative decoding and silicon-boundary gatekeepers.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('shorts')}
                  className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-mono font-bold tracking-wider shrink-0 transition-colors flex items-center space-x-1"
                >
                  <span>Open shorts viewer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="font-editorial text-lg text-slate-800 leading-[1.8]">
                This recursive self-check consumes negligible memory overhead thanks to flash-attention kernels optimized explicitly for 2-nanometer tensor processing architectures. The outcome is absolute determinism across domains previously deemed prone to catastrophic drift.
              </p>
            </div>

            {/* Section 02 */}
            <div className="pt-8 font-sans">
              <div className="text-xs font-mono text-slate-400 tracking-wider font-bold mb-1">
                Hardware verification
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 font-sans mb-4">
                02 / Eliminating Hallucination at the Silicon Boundary
              </h2>

              <p className="font-editorial text-lg text-slate-800 leading-[1.8] mb-6">
                What distinguishes this release from preceding frontier model iterations is its hardware-level verification interlock. Rather than software post-filtering—which routinely introduces latency penalties upwards of 400 milliseconds—the verification layer is etched into the micro-kernel itself.
              </p>

              {/* FIGURE 2: SVG Chart */}
              <div className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200 mb-4">
                  <span className="font-bold text-slate-800">
                    Figure 2: Latency vs. Verification Confidence Loop
                  </span>
                  <span>n=12,500 empirical passes</span>
                </div>

                {/* SVG Latency Chart matching 1.png */}
                <div className="py-4">
                  <svg viewBox="0 0 500 160" className="w-full h-auto" fill="none">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="60" x2="480" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="100" x2="480" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Axis Labels */}
                    <text x="40" y="155" fill="#64748b" fontSize="9">0ms</text>
                    <text x="220" y="155" fill="#64748b" fontSize="9">60ms</text>
                    <text x="460" y="155" fill="#64748b" fontSize="9">120ms</text>

                    {/* Baseline Autoregressive (dashed curve) */}
                    <path
                      d="M 40 135 C 150 130, 260 125, 480 115"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Scribe-IX Verified Synthesizer Curve (Green sharp inflection) */}
                    <path
                      d="M 40 135 C 100 130, 180 90, 240 50 L 480 35"
                      stroke="#059669"
                      strokeWidth="3"
                    />

                    {/* Verification Point Marker */}
                    <circle cx="240" cy="50" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <rect x="235" y="32" width="165" height="15" rx="3" fill="#047857" />
                    <text x="240" y="43" fill="#ffffff" fontSize="9" fontWeight="bold">
                      Verification point [18ms / 99.6%]
                    </text>
                  </svg>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span>
                    <span className="font-bold text-slate-900">Scribe-IX Verified Synthesizer</span>
                    <span className="text-emerald-700 font-bold">Delta: -74.1% latency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-0.5 bg-slate-400 stroke-dasharray inline-block"></span>
                    <span>Legacy Autoregressive Pipeline</span>
                  </div>
                </div>
              </div>

              <p className="font-editorial text-lg text-slate-800 leading-[1.8]">
                "When you operate in sovereign defense avionics or multi-trillion dollar asset settlement rails, a 98% accuracy rate is indistinguishable from 0%," remarked chief research scientist Tara Chen. "The synthesis architecture enforces mathematically sound preconditions before a single output packet departs the server enclosure."
              </p>
            </div>
          </div>

          {/* Right Telemetry Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* INDEXED ENTITIES Card */}
            <div className="bg-[#f8fafc] rounded-xl border border-slate-200 p-5 font-mono text-xs">
              <h3 className="text-slate-400 font-bold tracking-wider text-[11px] mb-4">
                Indexed entities
              </h3>

              <div className="space-y-3">
                {FEATURED_ARTICLE.indexedEntities.map((ent) => (
                  <div
                    key={ent.name}
                    className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{ent.name}</div>
                      <div className="text-[11px] text-slate-500">{ent.location}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ent.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFICATION RUNTIME Terminal Card (matching 1.png) */}
            <div className="bg-[#0b1017] text-white rounded-xl border border-[#1b2533] p-5 font-mono">
              <div className="flex items-center justify-between text-xs text-emerald-400 pb-2 mb-2 border-b border-slate-800">
                <span className="font-bold">Verification runtime</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              <div className="text-3xl font-black text-emerald-400 tracking-tight my-2">
                99.982%
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-error format execution threshold sustained across 160M tokens.
              </p>
            </div>

            {/* DISPATCH SIGNAL DESK Box */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 font-mono text-xs">
              <div className="text-slate-400 font-bold tracking-wider text-[10px] mb-2">
                Dispatch signal desk
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                Have technical documentation or benchmark anomalies regarding Project Scribe-IX?
              </p>
              <a
                href="#signal"
                onClick={(e) => {
                  e.preventDefault();
                  alert('PGP Fingerprint for Next Edit Investigation Unit: 9F2A 4C81 0D38');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
              >
                <span>Send PGP Encrypted Intel</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* GO DEEPER Section (matching 1.png) */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400">
                Synthesis intelligence
              </span>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Go Deeper
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Expand context via triangulated dispatch formats
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Related 1: Article */}
            <div
              onClick={() => onNavigate('home')}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">[Related article]</span>
                  <span>4 min read</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                    alt="Sovereign AI Race"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  The Sovereign AI Race: How 14 Nations Are Building Independent Foundation Models
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  National security imperatives compel state-backed computing clusters to bypass single-provider hegemony.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Read investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Related 2: Interview */}
            <div
              onClick={() => onNavigate('interview')}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">[Related interview]</span>
                  <span>28:40 video</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
                    alt="Dario Amodei"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  Dario Amodei on Constitutional AI & The Autonomous Timeline
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  A masterclass discussion covering compute scaling law limits, synthetic feedback, and safety verification.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Watch conversation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Related 3: Short */}
            <div
              onClick={() => onNavigate('shorts')}
              className="bg-slate-50 rounded-lg border border-slate-200 p-5 hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                  <span className="text-slate-700 font-bold">[Related short]</span>
                  <span>0:55 short</span>
                </div>

                <div className="aspect-video bg-slate-900 rounded overflow-hidden mb-3 relative">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                    alt="TSMC Cleanroom"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  Inside TSMC\'s 2nm Cleanroom: The EUV mirror revolution
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  A 60-second micro-tour through the highest-precision manufacturing facility ever constructed.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center space-x-1 text-xs font-mono font-bold text-emerald-700 group-hover:underline">
                <span>Play short</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Dispatch Customization Protocol Box (matching 1.png) */}
        <section className="mt-12 p-6 rounded-xl bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              Dispatch customization protocol
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Stay Ahead of the Synthesizer Paradigm
            </h3>
            <p className="text-xs text-slate-500">
              Follow entities directly to configure your algorithmic telemetry and receive automated briefings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { label: 'Topic', name: 'AI & Compute' },
              { label: 'Lead researcher', name: 'Dario Amodei' },
              { label: 'Enterprise', name: 'Anthropic' },
            ].map((ent) => {
              const followed = followingMap[ent.name];
              return (
                <div key={ent.name} className="text-center">
                  <div className="text-[9px] font-mono text-slate-400 mb-0.5">
                    {ent.label}
                  </div>
                  <button
                    onClick={() => toggleFollow(ent.name)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                      followed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {ent.name} {followed ? '✓' : '+'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </article>

      {/* Sticky Bottom Reading Bar (matching 1.png) */}
      <aside aria-label="Reading controls" className="fixed bottom-0 inset-x-0 bg-[#070b10] border-t border-[#1f2937] text-white py-3 px-4 z-30 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-3 truncate mr-4">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold shrink-0 border border-emerald-500/40">
              Reading #842
            </span>
            <span className="text-slate-300 truncate font-semibold">
              Anthropic & DeepMind Architect Autonomous Model Synthesizers...
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onToggleSave(FEATURED_ARTICLE.id)}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <Bookmark className="w-3 h-3 fill-current" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
