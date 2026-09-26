import React, { useState, useEffect, useRef } from 'react';
import { ScreenView, ShortItem, CompanyOrg } from '../types';
import { SHORTS_LIST, COMPANIES_LIST } from '../data/mockData';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Bookmark,
  Share2,
  Plus,
  ArrowRight,
  ExternalLink,
  Headphones,
  Check,
  Building2,
  Globe,
  TrendingUp,
  Layers,
  Cpu,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface ShortsStageProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  onClose: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ShortsStage: React.FC<ShortsStageProps> = ({
  onNavigate,
  onClose,
  savedIds,
  onToggleSave,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(48); // 48 of 60 seconds
  const [topicFollowed, setTopicFollowed] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [followedCompanies, setFollowedCompanies] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentShort = SHORTS_LIST[currentIndex] || SHORTS_LIST[0];

  // Sync selected company to current short's company by default
  useEffect(() => {
    if (currentShort.companyId) {
      setSelectedCompanyId(currentShort.companyId);
    }
  }, [currentShort.id, currentShort.companyId]);

  // Active company profile
  const activeCompany: CompanyOrg =
    COMPANIES_LIST.find((c) => c.id === selectedCompanyId) ||
    COMPANIES_LIST.find((c) => c.id === currentShort.companyId) ||
    COMPANIES_LIST[0];

  // Up Next items excluding current
  const upNextList = SHORTS_LIST.filter((_, idx) => idx !== currentIndex);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const toggleCompanyFollow = (companyId: string) => {
    setFollowedCompanies((prev) => {
      const isNowFollowing = !prev[companyId];
      showToast(isNowFollowing ? `Following ${activeCompany.name}` : `Unfollowed ${activeCompany.name}`);
      return {
        ...prev,
        [companyId]: isNowFollowing,
      };
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        setCurrentIndex((prev) => (prev + 1) % SHORTS_LIST.length);
        setProgress(0);
      } else if (e.key === 'ArrowUp') {
        setCurrentIndex((prev) => (prev === 0 ? SHORTS_LIST.length - 1 : prev - 1));
        setProgress(0);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Mobile swipe gestures (swipe up/down to navigate shorts)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    // Swipe up -> Next short
    if (deltaY > 50) {
      setCurrentIndex((prev) => (prev + 1) % SHORTS_LIST.length);
      setProgress(0);
    } else if (deltaY < -50) {
      // Swipe down -> Prev short
      setCurrentIndex((prev) => (prev === 0 ? SHORTS_LIST.length - 1 : prev - 1));
      setProgress(0);
    }
    touchStartY.current = null;
  };

  // Simulate progress timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas visual telemetry simulation for the 9:16 reel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#060a10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 242, 170, 0.08)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Dynamic Holographic Circuit Simulation
      ctx.strokeStyle = '#00f2aa';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f2aa';
      ctx.shadowBlur = 8;

      const time = frame * 0.03;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const yPos = 140 + i * 45;
        ctx.moveTo(30, yPos);
        ctx.lineTo(120 + Math.sin(time + i) * 20, yPos);
        ctx.lineTo(160, yPos + Math.cos(time + i) * 25);
        ctx.lineTo(260, yPos);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Simulated Data matrix text
      ctx.fillStyle = 'rgba(0, 242, 170, 0.7)';
      ctx.font = '9px monospace';
      ctx.fillText(`OPERATIONAL • TEMP: ${(15.8 + Math.sin(time) * 0.2).toFixed(1)} mK`, 24, 70);
      ctx.fillText(`COHERENCE: ${(99.98 + Math.sin(time) * 0.01).toFixed(3)}%`, 24, 85);
      ctx.fillText(`QUANTUM PROOF MATRIX: #098A-38`, 24, 100);

      // Binary stream pulse
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.fillText(`[fit_state_vector: 0.9984]`, 24, 340);
      ctx.fillText(`[cal_path_check_ok: #14936754]`, 24, 355);
      ctx.fillText(`[be_fidelity: 99.96%]`, 24, 370);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentIndex]);

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec % 60);
    return `0:${s < 10 ? '0' : ''}${s}`;
  };

  const isCompanyFollowed = !!followedCompanies[activeCompany.id];

  return (
    <div className="bg-[#03060a] text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-emerald-400 font-mono text-xs shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-fade-in pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Telemetry Header Bar - Sticky & Mobile-Optimized */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#05090e]/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold flex items-center space-x-1.5 transition-colors border border-slate-800 active:scale-95"
            title="Exit Shorts (Esc)"
          >
            <ChevronLeft className="w-4 h-4 sm:hidden" />
            <X className="w-3.5 h-3.5 hidden sm:block" />
            <span className="text-[11px] sm:text-xs">Exit</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-400 pl-2 border-l border-slate-800">
            <span className="font-bold text-white uppercase tracking-wider">Shorts Stage</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono">EP. {currentShort.episodeNumber}</span>
          </div>
        </div>

        {/* Center / Mobile Indicator */}
        <div className="flex sm:hidden items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">EP. {currentShort.episodeNumber}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 truncate max-w-[120px]">{currentShort.subCategory}</span>
        </div>

        {/* Keyboard hints & Audio toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-[11px] text-slate-400">
          <div className="hidden lg:flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700">↓/↑</span>
              <span>Next Short</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700">Space</span>
              <span>Play/Pause</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700">M</span>
              <span>Mute</span>
            </span>
          </div>

          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* 2. Main Stage Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col items-center space-y-6 sm:space-y-8">
        {/* Stage & Floating Up Next Dock */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-8 w-full">
          {/* Reel Player (Responsive 9:16) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#070c14] flex flex-col justify-between p-3.5 sm:p-4 group select-none shrink-0"
          >
            {/* Background Canvas Visual */}
            <canvas
              ref={canvasRef}
              width={360}
              height={640}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/95 pointer-events-none"></div>

            {/* Top Reel Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  {currentShort.category} • {currentShort.subCategory}
                </span>
                <span className="text-slate-400 text-[10px]">
                  EP. {currentShort.episodeNumber}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-slate-800">
                  {formatSeconds(progress)} / 0:60
                </span>
              </div>
            </div>

            {/* Center Play/Pause Overlay on Click */}
            <div
              onClick={() => setIsPlaying((prev) => !prev)}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-emerald-400/90 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              )}
            </div>

            {/* Right Action Rail - Mobile Touch Optimized (min 44px) */}
            <div className="absolute right-2.5 sm:right-3 bottom-20 sm:bottom-24 z-20 flex flex-col items-center space-y-3 sm:space-y-4 font-mono text-xs">
              {/* Up/Down Reel Nav Buttons */}
              <div className="flex flex-col space-y-1 bg-black/80 rounded-full p-1 border border-slate-800 backdrop-blur-sm">
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => (prev === 0 ? SHORTS_LIST.length - 1 : prev - 1));
                    setProgress(0);
                  }}
                  className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Previous Short"
                >
                  <ChevronUp className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => (prev + 1) % SHORTS_LIST.length);
                    setProgress(0);
                  }}
                  className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                  title="Next Short"
                >
                  <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => onToggleSave(currentShort.id)}
                className="flex flex-col items-center group min-h-[44px] min-w-[44px] justify-center"
                title="Save Short"
              >
                <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors shadow-md">
                  <Bookmark
                    className={`w-4 h-4 ${savedIds.includes(currentShort.id) ? 'fill-emerald-400 text-emerald-400' : ''}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{currentShort.likes}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Short link copied to clipboard');
                }}
                className="flex flex-col items-center group min-h-[44px] min-w-[44px] justify-center"
                title="Share Short"
              >
                <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors shadow-md">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{currentShort.shares}</span>
              </button>

              {/* Follow Topic Button */}
              <button
                onClick={() => {
                  setTopicFollowed((prev) => {
                    const next = !prev;
                    showToast(next ? 'Topic added to radar' : 'Topic removed from radar');
                    return next;
                  });
                }}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-emerald-400 text-slate-950 font-bold flex flex-col items-center justify-center hover:bg-emerald-300 transition-transform active:scale-95 shadow-lg min-h-[44px] min-w-[44px]"
                title="Follow Topic"
              >
                {topicFollowed ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span className="text-[8px] font-mono leading-none">Topic</span>
              </button>
            </div>

            {/* Bottom Info & Scrubber */}
            <div className="relative z-10 space-y-1.5 sm:space-y-2 pr-14">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold">{currentShort.author}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{currentShort.authorRole}</span>
              </div>

              <h2 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {currentShort.title}
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {currentShort.description}
              </p>

              {/* Scrubber */}
              <div className="pt-1.5 sm:pt-2">
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00f2aa] h-full transition-all duration-300"
                    style={{ width: `${(progress / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Up Next Dock: Lateral on Desktop, Horizontal Touch Shelf on Mobile */}
          <div className="w-full lg:w-auto lg:absolute lg:left-[calc(50%+200px)] lg:top-1/2 lg:-translate-y-1/2 z-30 bg-[#090e17]/95 backdrop-blur-md rounded-2xl border border-slate-700/80 p-3 shadow-2xl flex flex-col items-start lg:items-center">
            <div className="flex items-center justify-between w-full mb-2 px-1 text-[11px] font-mono text-slate-400">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="tracking-wider uppercase text-[10px]">Up Next</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold ml-2">Auto-play</span>
            </div>

            {/* Thumbnails Container: horizontal scroll on mobile, vertical stack on desktop */}
            <div className="w-full flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible no-scrollbar p-0.5 snap-x snap-mandatory">
              {upNextList.map((short) => (
                <div
                  key={short.id}
                  onClick={() => {
                    const foundIndex = SHORTS_LIST.findIndex((s) => s.id === short.id);
                    if (foundIndex !== -1) {
                      setCurrentIndex(foundIndex);
                      setProgress(0);
                    }
                  }}
                  className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-slate-800 hover:border-emerald-400 transition-all hover:scale-105 shadow-md shrink-0 w-[91px] h-[91px] snap-start"
                  title={short.title}
                >
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-[91px] h-[91px] object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/90 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {short.duration.split(' ')[0]}
                  </span>
                  <div className="absolute top-1 left-1">
                    <span className="text-[9px] font-mono bg-black/80 text-slate-300 px-1 py-0.2 rounded">
                      EP.{short.episodeNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Feed Beneath Video Reel */}
        <div className="w-full space-y-4 sm:space-y-6 pt-2">
          {/* ========================================================================= */}
          {/* NEW SECTION: COMPANY PROFILE DOSSIER (Adaptive for Mobile & Desktop) */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0b1018] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden">
            {/* Subtle background glow accent */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Section Tag & Quick Company Switcher Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-bold tracking-wider uppercase text-[11px]">
                  Enterprise Profile Dossier
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[10px]">Verified Intelligence</span>
              </div>

              {/* Quick Select Pill Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-mono">
                <span className="text-slate-500 text-[10px] shrink-0 mr-1 hidden sm:inline">Inspect:</span>
                {COMPANIES_LIST.map((org) => {
                  const isSelected = org.id === activeCompany.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => setSelectedCompanyId(org.id)}
                      className={`px-2.5 py-1 rounded-md transition-all shrink-0 whitespace-nowrap text-[10px] font-bold ${
                        isSelected
                          ? 'bg-emerald-400 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {org.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company Hero Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-start sm:items-center space-x-3.5">
                {/* Org Tag Monogram */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-inner">
                  {activeCompany.tag}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {activeCompany.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/40">
                      {activeCompany.badge}
                    </span>
                    {activeCompany.stage && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 hidden sm:inline-block">
                        {activeCompany.stage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
                    {activeCompany.summary}
                  </p>
                </div>
              </div>

              {/* Follow / Dossier Action Buttons (Touch Friendly) */}
              <div className="flex items-center gap-2.5 sm:shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => toggleCompanyFollow(activeCompany.id)}
                  className={`min-h-[44px] flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 active:scale-95 ${
                    isCompanyFollowed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 shadow-[0_0_15px_rgba(0,242,170,0.2)]'
                  }`}
                >
                  {isCompanyFollowed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Following Org</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Follow Company</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('explore', activeCompany.name)}
                  className="min-h-[44px] px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  title="Explore All Intel"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4-Metric Telemetry Grid (2 cols on mobile, 4 cols on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
              <div className="bg-[#070c14] p-3 sm:p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Valuation / Cap</span>
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-white">
                  {activeCompany.valuation}
                </div>
              </div>

              <div className="bg-[#070c14] p-3 sm:p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mb-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Global HQ</span>
                </div>
                <div className="text-xs sm:text-sm font-bold font-mono text-white truncate">
                  {activeCompany.hq}
                </div>
              </div>

              <div className="bg-[#070c14] p-3 sm:p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Leadership</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {activeCompany.leadership || 'Executive Board'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {activeCompany.leadershipRole || 'Leadership'}
                </div>
              </div>

              <div className="bg-[#070c14] p-3 sm:p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Intelligence</span>
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                  {activeCompany.dispatchesCount}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Dispatches logged</div>
              </div>
            </div>

            {/* Key Technology Architecture & Recent Deployment Milestone */}
            <div className="space-y-4 pt-2">
              {activeCompany.keyTech && activeCompany.keyTech.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 mb-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold uppercase text-[10px] tracking-wider">
                      Core Technology Pillars
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {activeCompany.keyTech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeCompany.recentMilestone && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs">
                  <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 mr-2">
                      Recent Deployment Telemetry:
                    </span>
                    <span className="text-slate-300 leading-relaxed">
                      {activeCompany.recentMilestone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Card 2: Related Investigative Dispatch (Adaptive for Mobile & Desktop) */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0b1018] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">
              <div className="space-y-2.5 sm:space-y-3 flex-1">
                <div className="flex items-center justify-between sm:justify-start sm:space-x-3 text-xs font-mono">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Related investigative dispatch</span>
                  </span>
                  <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                    Monograph
                  </span>
                </div>

                <h3
                  onClick={() => onNavigate('article', 'dispatch-842')}
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                >
                  Anthropic & DeepMind Architect Autonomous Model Synthesizers with Real-Time Verification
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                  Explore the 14-page whitepaper breakdown detailing how hybrid neural-symbolic architectures enforce zero-drift safety boundaries on recursive agent networks.
                </p>

                <div className="text-xs font-mono text-slate-500 pt-1">
                  Elena Vance • 6 min read • <span className="text-emerald-400">Updated Today</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center pt-2 lg:pt-0">
                <button
                  onClick={() => onNavigate('article', 'dispatch-842')}
                  className="min-h-[44px] w-full sm:w-auto px-6 py-3 rounded-lg bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,242,170,0.25)] hover:shadow-[0_0_20px_rgba(0,242,170,0.4)] active:scale-95"
                >
                  <span>Read the full story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Card 3: Deep Interview (Adaptive for Mobile & Desktop) */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0b1018] rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
              <span className="font-bold flex items-center space-x-1.5">
                <Headphones className="w-4 h-4" />
                <span>Deep interview • 28:40</span>
              </span>
              <span className="text-slate-500 text-[10px]">Audio + Transcript</span>
            </div>

            <h3
              onClick={() => onNavigate('interview')}
              className="text-base sm:text-lg lg:text-xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer mb-2 leading-snug"
            >
              Dario Amodei on Constitutional AI & The Autonomous Timeline
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 max-w-4xl">
              A comprehensive sit-down regarding neural distillation, safety architectures, and real-time self-correcting logic.
            </p>

            <button
              onClick={() => onNavigate('interview')}
              className="min-h-[44px] text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 active:scale-95"
            >
              <span>Watch full 28-minute conversation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

