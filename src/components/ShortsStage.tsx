import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ScreenView, ShortItem } from '../types';
import { SHORTS_LIST } from '../data/mockData';
import {
  ChevronLeft,
  Camera,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  X,
  Send,
  Check,
  Sparkles,
  ExternalLink,
  Sliders,
  Radio,
} from 'lucide-react';

interface ShortsStageProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  onClose: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  handle: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

const DEFAULT_COMMENTS_MAP: Record<string, Comment[]> = {
  'short-1': [
    {
      id: 'c1',
      author: 'David Marcus',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      handle: '@dmarcus_ai',
      timeAgo: '2h ago',
      text: 'The sub-millisecond symbolic proof latency is what makes this viable in high-frequency trading and mission-critical aviation.',
      likes: 142,
    },
    {
      id: 'c2',
      author: 'Kavita Raman',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      handle: '@kavita_systems',
      timeAgo: '4h ago',
      text: 'Are they executing these symbolic matrices directly on optical co-packaged optics or still routing through standard PCIe Gen 6?',
      likes: 89,
    },
    {
      id: 'c3',
      author: 'Lucas Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      handle: '@lvance_kernel',
      timeAgo: '7h ago',
      text: 'Formal verification at scale is the only way autonomous agents will ever be granted sovereign treasury signing permissions.',
      likes: 56,
    },
  ],
  'short-2': [
    {
      id: 'c4',
      author: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80',
      handle: '@amara_fintech',
      timeAgo: '1h ago',
      text: 'In Nigeria and Kenya, local merchant settlement over stablecoin rails already beats SWIFT correspondent banking by 3 full days.',
      likes: 218,
    },
    {
      id: 'c5',
      author: 'Guillermo Gomez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      handle: '@guillermo_latam',
      timeAgo: '3h ago',
      text: 'Sub-cent remittance fees are permanently changing cross-border payroll across Latin America.',
      likes: 114,
    },
  ],
};

export const ShortsStage: React.FC<ShortsStageProps> = ({
  onNavigate,
  onClose,
  savedIds,
  onToggleSave,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(12); // seconds (out of 60)
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [dislikedShorts, setDislikedShorts] = useState<Record<string, boolean>>({});
  const [subscribedChannels, setSubscribedChannels] = useState<Record<string, boolean>>({});
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const [allComments, setAllComments] = useState<Record<string, Comment[]>>(DEFAULT_COMMENTS_MAP);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentShort: ShortItem = SHORTS_LIST[currentIndex] || SHORTS_LIST[0];
  const isCurrentLiked = !!likedShorts[currentShort.id];
  const isCurrentDisliked = !!dislikedShorts[currentShort.id];
  const isSubscribed = !!subscribedChannels[currentShort.author];
  const currentComments = allComments[currentShort.id] || [
    {
      id: 'default-1',
      author: 'Tech Researcher',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      handle: '@frontier_intel',
      timeAgo: '1h ago',
      text: 'Incredible breakdown. The telemetry signals in this dispatch are pristine.',
      likes: 42,
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHORTS_LIST.length);
    setProgress(0);
    setIsCommentsOpen(false);
    setIsMoreMenuOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SHORTS_LIST.length - 1 : prev - 1));
    setProgress(0);
    setIsCommentsOpen(false);
    setIsMoreMenuOpen(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayPulse(true);
    setTimeout(() => setShowPlayPulse(false), 500);
  };

  const handleLike = () => {
    setLikedShorts((prev) => {
      const willBeLiked = !prev[currentShort.id];
      if (willBeLiked) {
        showToast('Added to Liked Videos');
      }
      return { ...prev, [currentShort.id]: willBeLiked };
    });
    if (dislikedShorts[currentShort.id]) {
      setDislikedShorts((prev) => ({ ...prev, [currentShort.id]: false }));
    }
  };

  const handleDislike = () => {
    setDislikedShorts((prev) => ({
      ...prev,
      [currentShort.id]: !prev[currentShort.id],
    }));
    if (likedShorts[currentShort.id]) {
      setLikedShorts((prev) => ({ ...prev, [currentShort.id]: false }));
    }
  };

  const handleSubscribe = () => {
    setSubscribedChannels((prev) => {
      const nextState = !prev[currentShort.author];
      showToast(nextState ? `Subscribed to ${currentShort.author}` : `Unsubscribed`);
      return { ...prev, [currentShort.author]: nextState };
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Video link copied to clipboard!');
    } else {
      showToast('Shared: ' + currentShort.title);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      handle: '@you',
      timeAgo: 'Just now',
      text: commentInput.trim(),
      likes: 0,
    };

    setAllComments((prev) => ({
      ...prev,
      [currentShort.id]: [newComment, ...(prev[currentShort.id] || [])],
    }));

    setCommentInput('');
    showToast('Comment published');
  };

  // Keyboard controls: Up/Down arrow for next/prev, Space for play/pause, M for mute, Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        if (isCommentsOpen) {
          setIsCommentsOpen(false);
        } else if (isMoreMenuOpen) {
          setIsMoreMenuOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
        showToast(!isMuted ? 'Muted' : 'Unmuted');
      } else if (e.key === 'l' || e.key === 'L') {
        handleLike();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isMuted, isCommentsOpen, isMoreMenuOpen]);

  // Touch swipe gestures on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    if (deltaY > 60) {
      handleNext();
    } else if (deltaY < -60) {
      handlePrev();
    }
    touchStartY.current = null;
  };

  // Auto-advancing video progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentIndex]);

  // Animated background visual synthesizer on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle cyber grid
      ctx.strokeStyle = 'rgba(0, 242, 170, 0.05)';
      ctx.lineWidth = 1;
      const step = 20;
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

      // Moving kinetic waves
      const t = frame * 0.025;
      ctx.strokeStyle = '#00f2aa';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f2aa';
      ctx.shadowBlur = 10;

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const baseOffset = 220 + i * 50;
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = baseOffset + Math.sin(t + x * 0.02 + i) * 16 + Math.cos(t * 0.8 + i) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Telemetry particles
      ctx.fillStyle = 'rgba(0, 242, 170, 0.6)';
      for (let p = 0; p < 8; p++) {
        const px = ((frame * (p + 1) * 0.8) % canvas.width);
        const py = 120 + ((p * 45 + frame * 0.5) % 360);
        ctx.fillRect(px, py, 2.5, 2.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentIndex]);

  const likeCountNumber = useMemo(() => {
    const raw = currentShort.likes || '1.4K';
    const num = parseFloat(raw.replace(/[^0-9.]/g, '')) || 1.4;
    return isCurrentLiked ? (num + 0.1).toFixed(1) + 'K' : raw;
  }, [currentShort.likes, isCurrentLiked]);

  return (
    <div className="fixed inset-0 z-50 bg-[#05070b] flex items-center justify-center overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/60 text-emerald-400 font-mono text-xs shadow-2xl backdrop-blur-md flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - On desktop centers the iPhone mockup with navigation arrows */}
      <div className="relative w-full h-full flex items-center justify-center p-0 sm:p-4 md:p-6">
        {/* ========================================================================= */}
        {/* DESKTOP SIDE NAVIGATION CONTROLS (Next/Prev Buttons) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex flex-col items-center space-y-4 absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handlePrev}
            title="Previous Video (Up Arrow)"
            className="w-12 h-12 rounded-full bg-[#161f2e] hover:bg-[#202d42] text-white flex items-center justify-center transition-all border border-slate-700 hover:scale-105 shadow-xl active:scale-95 group"
          >
            <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <div className="text-[11px] font-mono text-slate-400 font-bold text-center">
            {currentIndex + 1} / {SHORTS_LIST.length}
          </div>
          <button
            onClick={handleNext}
            title="Next Video (Down Arrow)"
            className="w-12 h-12 rounded-full bg-[#161f2e] hover:bg-[#202d42] text-white flex items-center justify-center transition-all border border-slate-700 hover:scale-105 shadow-xl active:scale-95 group"
          >
            <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* THE IPHONE MOCKUP FRAME (EXACTLY MATCHING THE USER'S REFERENCE IMAGE) */}
        {/* ========================================================================= */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-full sm:h-[860px] sm:max-h-[94vh] sm:w-[420px] aspect-auto sm:aspect-[9/19.5] bg-black sm:rounded-[52px] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_0_12px_#181c24,0_0_0_14px_#272d3b] border sm:border-slate-800 flex flex-col justify-between overflow-hidden"
        >
          {/* Hardware Camera / Speaker Notch (iPhone Style) */}
          <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 z-50 w-40 h-6 bg-[#000000] rounded-b-2xl items-center justify-center space-x-3 pointer-events-none">
            {/* Speaker bar */}
            <div className="w-12 h-1 bg-[#232731] rounded-full"></div>
            {/* Front camera lens */}
            <div className="w-2.5 h-2.5 bg-[#111622] border border-[#2b3345] rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-[#1d3557] rounded-full"></div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIDEO BACKGROUND / MEDIA CANVAS */}
          {/* ========================================================================= */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-0 bg-[#070b12] cursor-pointer overflow-hidden"
          >
            {/* Real Background Image from short item */}
            <img
              src={currentShort.thumbnail}
              alt={currentShort.title}
              className="w-full h-full object-cover opacity-50 brightness-95 filter contrast-110 scale-105 transition-transform duration-1000 ease-out"
            />

            {/* Kinetic animated visual overlay canvas */}
            <canvas
              ref={canvasRef}
              width={380}
              height={760}
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40 pointer-events-none"
            />

            {/* Gradient vignetting overlay for maximum contrast and high-signal text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none"></div>

            {/* Play / Pause Animated Icon Pulse on tap */}
            {showPlayPulse && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white animate-ping">
                  {isPlaying ? <Play className="w-9 h-9 fill-white" /> : <Pause className="w-9 h-9 fill-white" />}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* TOP IN-PHONE HEADER (< Back, Title, Camera Icon) */}
          {/* ========================================================================= */}
          <div className="relative z-30 px-4 pt-4 sm:pt-8 flex items-center justify-between text-white">
            {/* Left: Back chevron button */}
            <button
              onClick={onClose}
              title="Back to Home (Esc)"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Center: Sound track / Telemetry badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider">{currentShort.category}</span>
            </div>

            {/* Right: Camera / Mute Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                  showToast(!isMuted ? 'Muted' : 'Unmuted');
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMoreMenuOpen(true);
                }}
                title="Options"
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 active:scale-90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT ACTION COLUMN (ICONIC SHORTS VERTICAL ACTION RAIL) */}
          {/* Matches the user's reference image: ... More, ThumbsUp, ThumbsDown, Comment, Share, Sound Box */}
          {/* ========================================================================= */}
          <div className="absolute right-3 bottom-14 z-30 flex flex-col items-center space-y-4 text-white">
            {/* 1. More Options (...) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMoreMenuOpen((prev) => !prev);
              }}
              title="More options"
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg group-hover:border-white/30 transition-all">
                <MoreVertical className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* 2. Like (Thumbs Up) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              title="Like"
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div
                className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg transition-all ${
                  isCurrentLiked
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105'
                    : 'bg-black/50 hover:bg-black/80 border-white/15 text-white group-hover:border-white/30'
                }`}
              >
                <ThumbsUp
                  className={`w-5 h-5 transition-transform ${isCurrentLiked ? 'fill-slate-950 scale-110' : 'group-hover:scale-110'}`}
                />
              </div>
              <span className="text-[11px] font-mono font-bold mt-1 tracking-tight text-white drop-shadow">
                {likeCountNumber}
              </span>
            </button>

            {/* 3. Dislike (Thumbs Down) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDislike();
              }}
              title="Dislike"
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div
                className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center shadow-lg transition-all ${
                  isCurrentDisliked
                    ? 'bg-rose-500 border-rose-400 text-white scale-105'
                    : 'bg-black/50 hover:bg-black/80 border-white/15 text-white group-hover:border-white/30'
                }`}
              >
                <ThumbsDown
                  className={`w-5 h-5 transition-transform ${isCurrentDisliked ? 'fill-white scale-110' : 'group-hover:scale-110'}`}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1 drop-shadow">Dislike</span>
            </button>

            {/* 4. Comments */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }}
              title="Comments"
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg group-hover:border-white/30 transition-all">
                <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] font-mono font-bold mt-1 text-white drop-shadow">
                {currentComments.length}
              </span>
            </button>

            {/* 5. Share (Curved Arrow) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              title="Share"
              className="flex flex-col items-center group transition-transform active:scale-90"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg group-hover:border-white/30 transition-all">
                <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1 drop-shadow">Share</span>
            </button>

            {/* 6. Sound / Waveform Square (Bottom Right of Action Rail) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showToast(`Audio Track: ${currentShort.author} Original Sound`);
              }}
              title="Sound Track"
              className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/50 p-1 flex items-center justify-center shadow-lg group active:scale-90 transition-transform overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>
              {/* Spinning Sound waveform thumbnail */}
              <div className="w-full h-full rounded-lg bg-black/80 flex items-center justify-center">
                <div className="flex items-center space-x-0.5">
                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse"></span>
                  <span className="w-0.5 h-4 bg-emerald-400 animate-pulse delay-75"></span>
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse delay-150"></span>
                  <span className="w-0.5 h-4 bg-emerald-400 animate-pulse delay-100"></span>
                </div>
              </div>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM METADATA OVERLAY (Channel Avatar, Name, Subscribe, Caption, Sound) */}
          {/* ========================================================================= */}
          <div className="relative z-30 px-4 pb-2.5 pt-0 mt-auto text-white pr-20 pointer-events-auto">
            {/* Channel Info Row */}
            <div className="flex items-center space-x-2.5 mb-2">
              {/* Channel Avatar with gradient ring */}
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-indigo-500 shadow-md shrink-0">
                <img
                  src={currentShort.thumbnail}
                  alt={currentShort.author}
                  className="w-full h-full rounded-full object-cover bg-slate-900"
                />
              </div>

              {/* Author Handle */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-white tracking-wide drop-shadow truncate max-w-[130px]">
                  @{currentShort.author.replace(/\s+/g, '').toLowerCase()}
                </span>

                {/* Subscribe Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all shadow-md active:scale-95 flex items-center space-x-1 shrink-0 ${
                    isSubscribed
                      ? 'bg-white/20 hover:bg-white/30 text-emerald-400 border border-emerald-400/40'
                      : 'bg-white hover:bg-slate-200 text-black'
                  }`}
                >
                  {isSubscribed && <Check className="w-3 h-3" />}
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>
            </div>

            {/* Video Headline / Caption */}
            <h2 className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2 drop-shadow-md mb-1.5">
              {currentShort.title}
            </h2>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {currentShort.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono font-bold text-emerald-400 hover:text-emerald-300 drop-shadow"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Audio Ticker Marquee */}
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300 drop-shadow mb-1">
              <Music className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
              <span className="truncate">
                ♫ {currentShort.author} • Original Telemetry Dispatch #{currentShort.episodeNumber}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCRUBBER PROGRESS BAR (Bottom of video viewport) */}
          {/* ========================================================================= */}
          <div className="relative z-30 w-full px-4 mb-2 shrink-0">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-linear rounded-full"
                style={{ width: `${(progress / 60) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* IPHONE HOME INDICATOR PILL */}
          {/* ========================================================================= */}
          <div className="relative z-30 pb-2.5 flex justify-center pointer-events-none shrink-0">
            <div className="w-32 h-1 bg-white/70 rounded-full"></div>
          </div>

          {/* ========================================================================= */}
          {/* SLIDE-UP COMMENTS DRAWER (YOUTUBE SHORTS STYLE) */}
          {/* ========================================================================= */}
          {isCommentsOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 top-36 z-40 bg-[#0e141e]/98 backdrop-blur-xl border-t border-slate-700/80 rounded-t-[32px] p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-300 text-white"
            >
              {/* Comments Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm text-white">Comments</span>
                  <span className="text-xs font-mono text-slate-400">({currentComments.length})</span>
                </div>
                <button
                  onClick={() => setIsCommentsOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar">
                {currentComments.map((comm) => (
                  <div key={comm.id} className="flex items-start space-x-3 text-xs">
                    <img
                      src={comm.avatar}
                      alt={comm.author}
                      className="w-7 h-7 rounded-full object-cover bg-slate-800 shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="font-bold text-slate-200">{comm.handle}</span>
                        <span className="text-[10px] text-slate-500">{comm.timeAgo}</span>
                      </div>
                      <p className="text-slate-300 font-sans mt-0.5 leading-relaxed">{comm.text}</p>
                      <div className="flex items-center space-x-3 mt-1.5 text-slate-400 font-mono text-[10px]">
                        <button className="flex items-center space-x-1 hover:text-white">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comm.likes}</span>
                        </button>
                        <button className="hover:text-white">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input Bar */}
              <form onSubmit={handleAddComment} className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a high-signal comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-3.5 py-2 text-xs font-sans text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-2 rounded-full bg-emerald-500 disabled:opacity-40 text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SLIDE-UP MORE OPTIONS MENU */}
          {/* ========================================================================= */}
          {isMoreMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 z-40 bg-[#0e141e]/98 backdrop-blur-xl border-t border-slate-700/80 rounded-t-[32px] p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="font-mono font-bold text-sm text-white">Playback Settings</span>
                <button
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {/* Playback speed selector */}
                <div>
                  <div className="text-slate-400 mb-2">Playback Speed:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          showToast(`Playback speed: ${speed}x`);
                          setIsMoreMenuOpen(false);
                        }}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          playbackSpeed === speed
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() => {
                      onToggleSave(currentShort.id);
                      showToast(savedIds.includes(currentShort.id) ? 'Removed from saved' : 'Saved to Your Edit');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-left flex items-center justify-between text-slate-200"
                  >
                    <span>{savedIds.includes(currentShort.id) ? 'Remove from Saved' : 'Save to Your Edit'}</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      handleShare();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-left flex items-center justify-between text-slate-200"
                  >
                    <span>Copy Video URL</span>
                    <Share2 className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
