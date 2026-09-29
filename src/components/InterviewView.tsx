import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ScreenView } from '../types';
import { ALL_INTERVIEWS, InterviewItem, InterviewChapter, InterviewComment } from '../data/interviewsData';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  SkipForward,
  Maximize,
  Minimize,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Check,
  Download,
  MoreHorizontal,
  Search,
  Mic,
  Bell,
  Menu,
  Home,
  Compass,
  Tv,
  FolderMinus,
  History,
  Clock,
  Flame,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Send,
  ArrowLeft,
  X,
  ExternalLink,
  CheckCircle2,
  Video,
} from 'lucide-react';

interface InterviewViewProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  onNavigate,
  savedIds,
  onToggleSave,
}) => {
  // Navigation / View State
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null); // null = Browse Grid View (Image 1), string = Player Watch View (Image 2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryChip, setSelectedCategoryChip] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Player State (for Watch View)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(1182); // default ~19:42
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive User Actions
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [dislikedVideos, setDislikedVideos] = useState<Record<string, boolean>>({});
  const [subscribedChannels, setSubscribedChannels] = useState<Record<string, boolean>>({
    'Anthropic': true,
  });
  const [commentInput, setCommentInput] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, InterviewComment[]>>({});

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const categories = [
    'All',
    'AI & Reasoning',
    'Robotics & Embodied AI',
    'Fintech & Sovereign Rails',
    'Silicon & Optics',
    'Clean Baseload Energy',
    'Quantum Computing',
    'BioTech & Health',
    'Cybersecurity',
    'Live Broadcasts',
  ];

  const currentInterview: InterviewItem = useMemo(() => {
    if (!activeInterviewId) return ALL_INTERVIEWS[0];
    return ALL_INTERVIEWS.find((i) => i.id === activeInterviewId) || ALL_INTERVIEWS[0];
  }, [activeInterviewId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered interviews for the Browse Grid View (Image 1)
  const filteredInterviews = useMemo(() => {
    return ALL_INTERVIEWS.filter((item) => {
      if (selectedCategoryChip === 'Live Broadcasts') {
        if (!item.isLive) return false;
      } else if (selectedCategoryChip !== 'All' && item.category !== selectedCategoryChip) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesGuest = item.guest.name.toLowerCase().includes(q);
        const matchesCompany = item.guest.company.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesGuest && !matchesCompany && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategoryChip, searchQuery]);

  // Comments for current video
  const activeComments = useMemo(() => {
    return commentsMap[currentInterview.id] || currentInterview.comments || [];
  }, [commentsMap, currentInterview]);

  const isCurrentLiked = !!likedVideos[currentInterview.id];
  const isCurrentDisliked = !!dislikedVideos[currentInterview.id];
  const isSubscribed = !!subscribedChannels[currentInterview.guest.company] || !!subscribedChannels[currentInterview.guest.name];
  const isSaved = savedIds.includes(currentInterview.id);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSecond((prev) => {
        if (prev >= currentInterview.durationSeconds) {
          if (autoplayNext) {
            handlePlayNext();
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentInterview, autoplayNext]);

  // Audio / Visualizer canvas in video player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const draw = () => {
      step++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        ctx.fillStyle = 'rgba(0, 242, 170, 0.4)';
        const bars = 36;
        const barWidth = canvas.width / bars;

        for (let i = 0; i < bars; i++) {
          const height = Math.abs(Math.sin((step * 0.05) + i * 0.3)) * (canvas.height * 0.45) + 6;
          ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleSelectInterview = (interview: InterviewItem) => {
    setActiveInterviewId(interview.id);
    setCurrentSecond(8);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayNext = () => {
    const currentIdx = ALL_INTERVIEWS.findIndex((i) => i.id === currentInterview.id);
    const nextIdx = (currentIdx + 1) % ALL_INTERVIEWS.length;
    handleSelectInterview(ALL_INTERVIEWS[nextIdx]);
    showToast(`Playing next: ${ALL_INTERVIEWS[nextIdx].guest.name}`);
  };

  const handleToggleLike = () => {
    setLikedVideos((prev) => {
      const willBeLiked = !prev[currentInterview.id];
      if (willBeLiked) showToast('Added to Liked videos');
      return { ...prev, [currentInterview.id]: willBeLiked };
    });
    if (dislikedVideos[currentInterview.id]) {
      setDislikedVideos((prev) => ({ ...prev, [currentInterview.id]: false }));
    }
  };

  const handleToggleDislike = () => {
    setDislikedVideos((prev) => ({ ...prev, [currentInterview.id]: !prev[currentInterview.id] }));
    if (likedVideos[currentInterview.id]) {
      setLikedVideos((prev) => ({ ...prev, [currentInterview.id]: false }));
    }
  };

  const handleToggleSubscribe = () => {
    const key = currentInterview.guest.company;
    setSubscribedChannels((prev) => {
      const next = !prev[key];
      showToast(next ? `Subscribed to ${key}` : `Subscription removed`);
      return { ...prev, [key]: next };
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Interview link copied to clipboard!');
    } else {
      showToast('Link ready to share');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComm: InterviewComment = {
      id: `comm-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      handle: '@you',
      timeAgo: 'Just now',
      text: commentInput.trim(),
      likes: 0,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [currentInterview.id]: [newComm, ...(prev[currentInterview.id] || currentInterview.comments || [])],
    }));

    setCommentInput('');
    showToast('Comment published');
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentSecond(Math.floor(percentage * currentInterview.durationSeconds));
  };

  const handleChapterClick = (chapter: InterviewChapter) => {
    setCurrentSecond(chapter.seconds);
    setIsPlaying(true);
    showToast(`Jumped to ${chapter.time} • ${chapter.title}`);
  };

  // Find active chapter based on currentSecond
  const currentChapter = useMemo(() => {
    if (!currentInterview.chapters?.length) return null;
    let found = currentInterview.chapters[0];
    for (const ch of currentInterview.chapters) {
      if (currentSecond >= ch.seconds) {
        found = ch;
      }
    }
    return found;
  }, [currentInterview, currentSecond]);

  return (
    <div className="bg-[#f9f9f9] text-[#0f0f0f] min-h-screen flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[90] px-4 py-2.5 rounded-lg bg-[#212121] text-white text-xs font-mono shadow-2xl flex items-center space-x-2 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP YOUTUBE DESKTOP HEADER (Matches Images 1 & 2) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-14 px-4 flex items-center justify-between shadow-xs">
        {/* Left Side: Hamburger & Guide Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Guide"
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Center: YouTube Search Bar with Search Icon & Voice Mic */}
        <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4">
          <div className="flex items-center w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search frontier interviews, operators, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-10 rounded-l-full border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {}}
              title="Search"
              className="h-10 px-6 rounded-r-full bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          <button
            onClick={() => showToast('Voice search activated...')}
            title="Search with your voice"
            className="ml-3 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors"
          >
            <Mic className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Right Side: Action Icons */}
        <div className="flex items-center space-x-2">
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY LAYOUT: MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex flex-1 overflow-x-hidden">
        {/* ========================================================================= */}
        {/* MAIN VIEWPORT: SWITCHES BETWEEN BROWSE GRID (Image 1) & WATCH VIEW (Image 2) */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* ======================================================================= */}
          {/* VIEW A: BROWSE GRID VIEW (EXACTLY MATCHING IMAGE 1) */}
          {/* ======================================================================= */}
          {!activeInterviewId ? (
            <div>
              {/* Category Pills Strip (Matching Image 1: Todo, kygo, musica, jazz...) */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryChip(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryChip === cat
                        ? 'bg-[#0f0f0f] text-white shadow-xs'
                        : 'bg-slate-200/80 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Live Broadcast Feature Banner (If Live is active) */}
              {selectedCategoryChip === 'Live Broadcasts' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shadow-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                    <div>
                      <div className="font-mono text-xs font-bold uppercase tracking-wider">NexTake Live Desk</div>
                      <div className="text-sm font-bold">Pan-African Instant FX Corridors Transmission Live</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectInterview(ALL_INTERVIEWS[2])}
                    className="px-4 py-1.5 rounded-full bg-white text-red-700 font-bold text-xs"
                  >
                    Join Stream
                  </button>
                </div>
              )}

              {/* Video Grid (4 columns across on desktop, matching Image 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    onClick={() => handleSelectInterview(interview)}
                    className="group cursor-pointer flex flex-col space-y-3"
                  >
                    {/* 16:9 Thumbnail with Duration Badge */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-xs group-hover:rounded-none transition-all duration-200">
                      <img
                        src={interview.thumbnail}
                        alt={interview.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Live Badge or Duration Badge in Bottom Right (matching Image 1) */}
                      {interview.isLive ? (
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1 shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          <span>EN DIRECTO AHORA</span>
                        </div>
                      ) : (
                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white font-mono font-bold text-[11px] px-1.5 py-0.5 rounded shadow">
                          {interview.duration}
                        </div>
                      )}

                    </div>

                    {/* Meta Row: Avatar + Title + Channel + Views */}
                    <div className="flex space-x-3 items-start">
                      {/* Guest / Channel Avatar */}
                      <img
                        src={interview.guest.avatar}
                        alt={interview.guest.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 bg-slate-200 border border-slate-300"
                      />

                      <div className="flex-1 min-w-0">
                        {/* Title (2 lines clamp, bold, clean) */}
                        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                          {interview.title}
                        </h3>

                        {/* Channel / Guest Name with Verified Checkmark */}
                        <div className="mt-1 flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900">
                          <span className="truncate">{interview.guest.name} • {interview.guest.company}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 fill-slate-200 shrink-0" />
                        </div>

                        {/* Views & Timestamp */}
                        <div className="text-xs text-slate-500 flex items-center space-x-1">
                          <span>{interview.views}</span>
                          <span>•</span>
                          <span>{interview.uploadedAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ======================================================================= */
            /* VIEW B: WATCH PLAYER VIEW (EXACTLY MATCHING IMAGE 2) */
            /* ======================================================================= */
            <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ===================================================================== */}
              {/* LEFT / MAIN COLUMN (Player + Info + Description + Comments) */}
              {/* ===================================================================== */}
              <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-8'} space-y-4`}>
                {/* 16:9 Interactive Video Player */}
                <div
                  ref={videoContainerRef}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group border border-slate-800"
                >
                  {/* Video Poster Image & Animation Canvas */}
                  <img
                    src={currentInterview.thumbnail}
                    alt={currentInterview.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                  />

                  {/* Dynamic Audio Visualizer Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={720}
                    height={360}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
                  />

                  {/* Gradient Overlay for Player Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Big Play / Pause Overlay Icon in center */}
                  <button
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform"
                  >
                    {!isPlaying && (
                      <div className="w-18 h-18 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    )}
                  </button>

                  {/* ================================================================= */}
                  {/* BOTTOM PLAYER CONTROLS BAR (Matches Image 2) */}
                  {/* ================================================================= */}
                  <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-3 pt-6 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end space-y-2">
                    {/* Scrubber Progress Bar */}
                    <div
                      onClick={handleSeek}
                      className="w-full h-1.5 hover:h-2.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer relative transition-all group/scrubber"
                    >
                      <div
                        className="h-full bg-red-600 rounded-full relative"
                        style={{
                          width: `${(currentSecond / currentInterview.durationSeconds) * 100}%`,
                        }}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-red-600 absolute right-0 top-1/2 -translate-y-1/2 scale-0 group-hover/scrubber:scale-100 shadow-md"></div>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      {/* Left: Play/Pause, Next, Volume, Time */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setIsPlaying((prev) => !prev)}
                          className="hover:text-red-500 transition-colors"
                          title={isPlaying ? 'Pause (k)' : 'Play (k)'}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>

                        <button
                          onClick={handlePlayNext}
                          className="hover:text-red-500 transition-colors"
                          title="Next (Shift+N)"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>

                        {/* Volume controls */}
                        <div className="flex items-center space-x-1.5 group/volume">
                          <button
                            onClick={() => setIsMuted((prev) => !prev)}
                            className="hover:text-red-500 transition-colors"
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                              setVolume(parseFloat(e.target.value));
                              setIsMuted(false);
                            }}
                            className="w-16 h-1 accent-red-600 cursor-pointer hidden group-hover/volume:inline-block"
                          />
                        </div>

                        {/* Timestamp: 19:42 / 48:20 (Matching Image 2) */}
                        <div className="font-mono text-[11px] text-slate-300">
                          <span>{formatSeconds(currentSecond)}</span>
                          <span className="mx-1 text-slate-500">/</span>
                          <span>{formatSeconds(currentInterview.durationSeconds)}</span>
                        </div>
                      </div>

                      {/* Right: Speed, Theater, Fullscreen */}
                      <div className="flex items-center space-x-3 relative">
                        {/* Playback speed selector */}
                        <button
                          onClick={() => setIsSpeedMenuOpen((prev) => !prev)}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 font-mono text-[11px]"
                          title="Playback speed"
                        >
                          {playbackSpeed}x
                        </button>

                        {isSpeedMenuOpen && (
                          <div className="absolute right-12 bottom-8 z-30 bg-[#212121] rounded-lg shadow-xl p-1.5 border border-slate-700 flex flex-col space-y-1">
                            {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => {
                                  setPlaybackSpeed(spd);
                                  setIsSpeedMenuOpen(false);
                                  showToast(`Speed: ${spd}x`);
                                }}
                                className={`px-3 py-1 rounded text-xs text-left ${
                                  playbackSpeed === spd ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setIsTheaterMode((prev) => !prev)}
                          title="Theater mode"
                          className="hover:text-red-500 transition-colors"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (videoContainerRef.current) {
                              if (!document.fullscreenElement) {
                                videoContainerRef.current.requestFullscreen?.();
                              } else {
                                document.exitFullscreen?.();
                              }
                            }
                          }}
                          title="Fullscreen"
                          className="hover:text-red-500 transition-colors"
                        >
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================================== */}
                {/* VIDEO TITLE (Matching Image 2: Large Bold Title) */}
                {/* =================================================================== */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
                    {currentInterview.title}
                  </h1>
                </div>

                {/* =================================================================== */}
                {/* CHANNEL BAR & ACTION PILLS (Matching Image 2) */}
                {/* Left: Avatar, Channel Name, Subscribers, SUBSCRIBE button */}
                {/* Right: ThumbsUp, ThumbsDown, Share, Save */}
                {/* =================================================================== */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200">
                  {/* Channel Meta */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentInterview.guest.avatar}
                      alt={currentInterview.guest.name}
                      className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-300 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5 font-bold text-sm text-slate-900">
                        <span>{currentInterview.guest.company} // {currentInterview.guest.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-slate-600 fill-slate-200" />
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {currentInterview.guest.subscribers}
                      </div>
                    </div>

                    {/* RED SUBSCRIBE BUTTON (Matching Image 2) */}
                    <button
                      onClick={handleToggleSubscribe}
                      className={`ml-3 px-4 py-2 rounded-full text-xs font-bold font-sans transition-all active:scale-95 shadow-xs ${
                        isSubscribed
                          ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                          : 'bg-[#cc0000] hover:bg-[#aa0000] text-white tracking-wider'
                      }`}
                    >
                      {isSubscribed ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}
                    </button>
                  </div>

                  {/* Right Action Buttons: Like, Dislike, Share, Save (Matching Image 2) */}
                  <div className="flex items-center space-x-2">
                    {/* Thumbs up & Thumbs down pill */}
                    <div className="flex items-center rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                      <button
                        onClick={handleToggleLike}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-200 transition-colors ${
                          isCurrentLiked ? 'text-red-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${isCurrentLiked ? 'fill-red-600' : ''}`} />
                        <span>{isCurrentLiked ? '16K' : '15K'}</span>
                      </button>
                      <div className="w-[1px] h-4 bg-slate-300"></div>
                      <button
                        onClick={handleToggleDislike}
                        className={`px-3 py-1.5 text-xs hover:bg-slate-200 transition-colors ${
                          isCurrentDisliked ? 'text-red-600' : 'text-slate-700'
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${isCurrentDisliked ? 'fill-red-600' : ''}`} />
                      </button>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                    {/* Save Button */}
                    <button
                      onClick={() => {
                        onToggleSave(currentInterview.id);
                        showToast(isSaved ? 'Removed from saved' : 'Saved to library');
                      }}
                      className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                {/* =================================================================== */}
                {/* EXPANDABLE DESCRIPTION BOX (Matching Image 2: Views, Date, Description) */}
                {/* =================================================================== */}
                <div className="bg-[#f2f2f2] hover:bg-[#e9e9e9] transition-colors rounded-xl p-3.5 text-xs text-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <span>{currentInterview.views}</span>
                    <span>•</span>
                    <span>{currentInterview.uploadedAgo}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-emerald-700">Rec ID: SF-2026-X42</span>
                  </div>

                  <p className={`text-slate-700 leading-relaxed font-sans ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                    {currentInterview.executiveSummary}
                  </p>

                  {/* Featured Quote */}
                  {isDescriptionExpanded && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-slate-900 font-mono text-[11px] leading-relaxed">
                      <div className="font-bold text-red-600 mb-1">
                        KEY QUOTE ({currentInterview.featuredQuote.timestamp}):
                      </div>
                      "{currentInterview.featuredQuote.text}"
                    </div>
                  )}

                  {/* Interactive Chapter Links (Clicking jumps to timestamp!) */}
                  {isDescriptionExpanded && currentInterview.chapters?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-300 space-y-1">
                      <div className="font-bold text-slate-900 font-mono uppercase tracking-wider mb-1">
                        TIMESTAMPS & CHAPTERS:
                      </div>
                      {currentInterview.chapters.map((ch, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleChapterClick(ch)}
                          className="cursor-pointer hover:text-blue-600 flex items-center space-x-2 py-0.5"
                        >
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                            {ch.time}
                          </span>
                          <span>{ch.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="font-bold text-slate-900 hover:underline pt-1 block"
                  >
                    {isDescriptionExpanded ? 'Show less' : '...more'}
                  </button>
                </div>

                {/* =================================================================== */}
                {/* COMMENTS SECTION (Matching YouTube Desktop UI) */}
                {/* =================================================================== */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="font-bold text-base text-slate-900 font-sans">
                      {activeComments.length} Comments
                    </span>
                    <button className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900">
                      <span>Sort by: Top comments</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add Public Comment Form */}
                  <form onSubmit={handleAddComment} className="flex items-start space-x-3 pt-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      EV
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Add a high-signal comment..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full bg-transparent border-b border-slate-300 focus:border-slate-900 focus:outline-none text-xs pb-1 text-slate-900 placeholder-slate-400"
                      />
                      {commentInput && (
                        <div className="flex justify-end space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setCommentInput('')}
                            className="px-3 py-1 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Comment Thread */}
                  <div className="space-y-4 pt-2">
                    {activeComments.map((comm) => (
                      <div key={comm.id} className="flex items-start space-x-3 text-xs">
                        <img
                          src={comm.avatar}
                          alt={comm.author}
                          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2 font-mono">
                            <span className="font-bold text-slate-900">{comm.handle}</span>
                            <span className="text-[11px] text-slate-500">{comm.timeAgo}</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-sans">{comm.text}</p>
                          <div className="flex items-center space-x-4 pt-0.5 text-slate-600 font-mono text-[11px]">
                            <button className="flex items-center space-x-1 hover:text-black">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{comm.likes}</span>
                            </button>
                            <button className="hover:text-black">
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                            <button className="font-sans font-bold hover:text-black">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* RIGHT SIDEBAR ("UP NEXT" RECOMMENDATIONS COLUMN - MATCHING IMAGE 2) */}
              {/* ===================================================================== */}
              <div className={`${isTheaterMode ? 'lg:col-span-12' : 'lg:col-span-4 xl:col-span-4'} space-y-3`}>
                {/* Header: Next + Autoplay toggle (Matching Image 2 "Next") */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-sm text-slate-900 font-sans">Next</span>
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
                    <span>Autoplay</span>
                    <button
                      onClick={() => setAutoplayNext((prev) => !prev)}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                        autoplayNext ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                          autoplayNext ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                {/* List of Recommended / Queued Interviews (Image 2 right rail) */}
                <div className="space-y-3">
                  {ALL_INTERVIEWS.filter((i) => i.id !== currentInterview.id).map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => handleSelectInterview(interview)}
                      className="group cursor-pointer flex space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      {/* Compact 16:9 Thumbnail */}
                      <div className="relative w-40 sm:w-44 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={interview.thumbnail}
                          alt={interview.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[10px] font-bold px-1 py-0.2 rounded">
                          {interview.duration}
                        </div>
                      </div>

                      {/* Info on Right */}
                      <div className="flex-1 min-w-0 flex flex-col justify-start">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {interview.title}
                        </h4>
                        <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-600">
                          <span className="truncate">{interview.guest.company}</span>
                          <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {interview.views} • {interview.uploadedAgo}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
