import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Tag, ShoppingBag, Clock, Percent, ExternalLink, Check } from 'lucide-react';
import shopperWomanImg from '../assets/images/sale_shopper_woman_1790347377287.jpg';
import techShopperImg from '../assets/images/tech_gear_shopper_1790347390847.jpg';

interface PromoSlide {
  id: string;
  badge: string;
  topWord: string;
  bottomWord: string;
  ctaText: string;
  discount: string;
  subtext: string;
  couponCode: string;
  image: string;
  themeColor: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'slide-1',
    badge: 'SPECIAL OFFER',
    topWord: 'FINAL',
    bottomWord: 'SALE',
    ctaText: 'SHOP NOW!',
    discount: 'UP TO 70% OFF',
    subtext: 'NexTake Annual Pro Terminal & Frontier Intelligence Bundle',
    couponCode: 'FINALSALE70',
    image: shopperWomanImg,
    themeColor: '#FFB800',
  },
  {
    id: 'slide-2',
    badge: 'LIMITED ACCESS',
    topWord: 'FLASH',
    bottomWord: 'PROMO',
    ctaText: 'CLAIM OFFER!',
    discount: '60% DISCOUNT',
    subtext: 'Silicon Optics & Quantum Hardware Intelligence Vault',
    couponCode: 'FLASHPRO60',
    image: techShopperImg,
    themeColor: '#FFC400',
  },
  {
    id: 'slide-3',
    badge: 'EXCLUSIVE PASS',
    topWord: 'FOUNDER',
    bottomWord: 'DEAL',
    ctaText: 'JOIN TODAY!',
    discount: 'SAVE $450',
    subtext: 'Direct Operator Briefings & VIP Editorial Community Access',
    couponCode: 'FOUNDERVIP',
    image: shopperWomanImg,
    themeColor: '#F5A623',
  },
  {
    id: 'slide-4',
    badge: 'MEGA SALE',
    topWord: 'SUPER',
    bottomWord: 'SALE',
    ctaText: 'GET ACCESS!',
    discount: 'HALF PRICE',
    subtext: 'Full Archive Dispatch & Telemetry Audio Suite Pass',
    couponCode: 'SUPERSALE50',
    image: techShopperImg,
    themeColor: '#EAA000',
  },
];

export const PromoRotatorBanner: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ROTATION_INTERVAL_MS = 4000;
  const TICK_MS = 40;

  // Constant rotation timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_MS / ROTATION_INTERVAL_MS) * 100;
        if (next >= 100) {
          setCurrentSlideIndex((oldIdx) => (oldIdx + 1) % PROMO_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentSlide = PROMO_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? PROMO_SLIDES.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleCtaClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentSlide.couponCode);
      setCopiedCode(currentSlide.couponCode);
      setTimeout(() => setCopiedCode(null), 3000);
    }
    setIsModalOpen(true);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-[1200px] mx-auto select-none group"
      style={{
        // Exactly matching 1200 x 628 aspect ratio requested
        aspectRatio: '1200 / 628',
      }}
    >
      {/* ========================================================================= */}
      {/* MAIN BANNER CONTAINER (1200 x 628 EXACT PROPORTIONS) */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] border-4 border-black/10 bg-[#FFB800] transition-colors duration-700">
        {/* ======================================================================= */}
        {/* BACKGROUND GRAPHIC MEMPHIS ELEMENTS (Matching 1.jpeg) */}
        {/* ======================================================================= */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-Left Angled Black Wedge */}
          <div
            className="absolute -top-12 -left-12 w-64 h-64 bg-[#111111] transform -rotate-12 z-0 shadow-lg"
            style={{ clipPath: 'polygon(0 0, 100% 0, 45% 100%, 0% 100%)' }}
          ></div>

          {/* Bottom-Left Angled Black Wedge */}
          <div
            className="absolute -bottom-16 -left-12 w-72 h-72 bg-[#111111] transform rotate-6 z-0 shadow-lg"
            style={{ clipPath: 'polygon(0 30%, 100% 100%, 0 100%)' }}
          ></div>

          {/* Top-Right Angled Black Accent Stripe */}
          <div
            className="absolute -top-16 right-36 w-20 h-96 bg-[#111111] transform rotate-45 z-0 opacity-90"
            style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
          ></div>

          {/* White Accent Stripe Parallel to Right Accent */}
          <div className="absolute -top-20 right-60 w-3 h-80 bg-white transform rotate-45 z-0 opacity-80"></div>
          <div className="absolute top-28 right-80 w-2.5 h-44 bg-white transform rotate-45 z-0 opacity-80"></div>

          {/* Bottom Center Black Curved Geometric Shape (Behind text and shopper) */}
          <div className="absolute -bottom-10 left-1/3 w-80 h-64 bg-[#111111] rounded-t-full transform -rotate-6 opacity-90 z-0"></div>

          {/* Dot Matrix Pattern 1 (Top Left) */}
          <div className="absolute top-6 left-6 z-10 opacity-70">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="#ffffff">
              {[0, 15, 30, 45, 60, 75].map((x) =>
                [0, 15, 30, 45].map((y) => (
                  <circle key={`tl-${x}-${y}`} cx={x} cy={y} r="2" />
                ))
              )}
            </svg>
          </div>

          {/* Dot Matrix Pattern 2 (Right Behind Shopper) */}
          <div className="absolute top-20 right-10 z-0 opacity-60">
            <svg width="90" height="90" viewBox="0 0 90 90" fill="#111111">
              {[0, 15, 30, 45, 60, 75].map((x) =>
                [0, 15, 30, 45, 60, 75].map((y) => (
                  <circle key={`r-${x}-${y}`} cx={x} cy={y} r="2" />
                ))
              )}
            </svg>
          </div>

          {/* Dot Matrix Pattern 3 (Bottom Center Left) */}
          <div className="absolute bottom-10 left-48 z-10 opacity-40">
            <svg width="70" height="50" viewBox="0 0 70 50" fill="#111111">
              {[0, 14, 28, 42, 56].map((x) =>
                [0, 14, 28, 42].map((y) => (
                  <circle key={`bc-${x}-${y}`} cx={x} cy={y} r="1.5" />
                ))
              )}
            </svg>
          </div>

          {/* Floating Red and White Memphis Triangles (Exact details from 1.jpeg) */}
          <div className="absolute top-16 left-32 text-red-500 font-black text-xl animate-pulse">▲</div>
          <div className="absolute top-36 left-12 text-white font-black text-lg">△</div>
          <div className="absolute bottom-24 left-20 text-red-500 font-black text-sm transform rotate-45">▲</div>
          <div className="absolute top-10 right-36 text-red-500 font-black text-lg">▲</div>
          <div className="absolute bottom-16 right-96 text-red-500 font-black text-sm">△</div>

          {/* Diagonal White Speed Lines in Center */}
          <div className="absolute top-1/2 left-32 w-52 h-1.5 bg-white transform -rotate-12 z-0 opacity-90 rounded-full"></div>
          <div className="absolute top-[62%] left-24 w-36 h-1.5 bg-white transform -rotate-12 z-0 opacity-90 rounded-full"></div>
        </div>

        {/* ======================================================================= */}
        {/* BANNER CONTENT (LEFT TEXT CHEVRONS + RIGHT PHOTOGRAPHY) */}
        {/* ======================================================================= */}
        <div className="relative z-10 w-full h-full flex flex-row items-center justify-between p-4 sm:p-8 md:p-12">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: CHEVRON BANNERS & PROMO BADGES (Exact Replica of 1.jpeg) */}
          {/* ===================================================================== */}
          <div className="flex-1 flex flex-col justify-center items-start space-y-2 sm:space-y-3 max-w-[62%] sm:max-w-[58%] z-20">
            {/* 1. TOP WHITE TILTED BADGE: "SPECIAL OFFER" */}
            <div className="transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="inline-flex items-center space-x-1.5 px-3 sm:px-5 py-1 sm:py-1.5 bg-white text-black font-black text-[10px] sm:text-xs md:text-sm tracking-wider uppercase shadow-[3px_4px_0px_#111111] rounded-xs border-2 border-black">
                <span>{currentSlide.badge}</span>
                <span className="ml-1 text-[9px] font-mono bg-red-600 text-white px-1.5 py-0.2 rounded font-bold">
                  {currentSlide.discount}
                </span>
              </div>
            </div>

            {/* 2. UPPER BLACK CHEVRON: "FINAL" */}
            <div
              className="relative w-full max-w-[420px] bg-[#111111] text-[#FFB800] py-2 sm:py-3 px-6 sm:px-9 shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-0.5"
              style={{
                // Angular chevron arrow pointing right
                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              }}
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {currentSlide.topWord}
              </h2>
            </div>

            {/* 3. LOWER BLACK CHEVRON: "SALE" */}
            <div
              className="relative w-full max-w-[420px] bg-[#111111] text-[#FFB800] py-2 sm:py-3 px-6 sm:px-9 shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-0.5"
              style={{
                // Angular chevron arrow pointing right
                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              }}
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {currentSlide.bottomWord}
              </h2>
            </div>

            {/* 4. BOTTOM WHITE TILTED BADGE: "SHOP NOW!" (Interactive Button) */}
            <div className="pt-2 sm:pt-3">
              <button
                onClick={handleCtaClick}
                className="transform -rotate-1 hover:rotate-0 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2 px-4 sm:px-7 py-2 sm:py-2.5 bg-white text-black font-black text-xs sm:text-base md:text-lg tracking-wider uppercase shadow-[4px_5px_0px_#111111] rounded-xs border-2 border-black group/btn cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 fill-red-600 group-hover/btn:rotate-12 transition-transform" />
                <span className="underline decoration-2 underline-offset-4 font-black">
                  {currentSlide.ctaText}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              <div className="mt-2 text-[10px] sm:text-xs font-mono font-bold text-black/80 flex items-center space-x-2">
                <span className="bg-black/10 px-2 py-0.5 rounded border border-black/20">
                  CODE: <span className="font-black text-red-700">{currentSlide.couponCode}</span>
                </span>
                {copiedCode && (
                  <span className="text-emerald-800 font-bold flex items-center space-x-1 animate-bounce">
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: HIGH-RES PHOTOGRAPHY MATCHING 1.jpeg */}
          {/* (Smiling Shopper in mustard jacket holding vibrant red bags) */}
          {/* ===================================================================== */}
          <div className="relative flex-1 h-full flex items-end justify-center sm:justify-end z-10 pointer-events-none">
            {/* Soft backdrop glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-white/20 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            {/* Shopper Portrait with Realistic Floating Red "SALE" Tag */}
            <div className="relative h-[95%] sm:h-full max-h-[580px] aspect-[4/5] flex items-end">
              <img
                src={currentSlide.image}
                alt="Sale Shopper"
                className="w-full h-full object-contain object-bottom filter contrast-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition-all duration-700 ease-out"
              />

              {/* Floating Red "SALE" Price Tag attached near ear (as seen in 1.jpeg) */}
              <div className="absolute top-14 sm:top-20 left-4 sm:left-10 z-20 transform -rotate-12 hover:rotate-6 transition-transform animate-pulse">
                <div className="relative bg-red-600 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-wider py-1 px-2.5 rounded-sm shadow-md border border-white/60 flex items-center space-x-1">
                  {/* Punch Hole */}
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-0.5"></span>
                  <Tag className="w-3 h-3 text-white fill-white" />
                  <span>SALE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CONSTANT ROTATION PROGRESS BAR & CONTROLS AT BOTTOM */}
        {/* ======================================================================= */}
        <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col pointer-events-auto">
          {/* Continuous Running Progress Indicator Line */}
          <div className="w-full h-1.5 bg-black/20 overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Bar with Slide Navigation Dots & Prev/Next Arrows */}
          <div className="bg-[#111111]/90 backdrop-blur-xs px-4 py-1.5 flex items-center justify-between text-white text-xs font-mono">
            {/* Left: Constant Rotation Status */}
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                Constant Rotation: {currentSlideIndex + 1} / {PROMO_SLIDES.length}
              </span>
              <span className="hidden md:inline text-slate-400">|</span>
              <span className="hidden md:inline text-[10px] text-slate-300 truncate max-w-xs">
                {currentSlide.subtext}
              </span>
            </div>

            {/* Center: Slide Indicators */}
            <div className="flex items-center space-x-1.5">
              {PROMO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setProgress(0);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-6 bg-[#FFB800]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right: Manual Prev / Next Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-white/20 active:scale-95 transition-all text-white"
                title="Previous Offer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-white/20 active:scale-95 transition-all text-white"
                title="Next Offer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROMO CHECKOUT / CODE MODAL (Opened when clicking "SHOP NOW!") */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111111] border-2 border-[#FFB800] rounded-2xl p-6 text-white shadow-2xl relative"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFB800] text-black font-black text-xl flex items-center justify-center mb-4">
              %
            </div>

            <h3 className="text-2xl font-black italic tracking-tight text-[#FFB800]">
              {currentSlide.topWord} {currentSlide.bottomWord}!
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-1">
              {currentSlide.subtext}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-black border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">Promo Code</div>
                <div className="text-lg font-mono font-black text-[#FFB800] tracking-wider">
                  {currentSlide.couponCode}
                </div>
              </div>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(currentSlide.couponCode);
                    setCopiedCode(currentSlide.couponCode);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#FFB800] text-black font-bold font-mono text-xs hover:bg-yellow-400 active:scale-95 transition-all flex items-center space-x-1"
              >
                {copiedCode === currentSlide.couponCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy Code</span>
                )}
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300 font-sans">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                <span>Instant {currentSlide.discount} applied at checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                <span>Full access to all terminal dispatches & audio reels</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white text-black font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
