import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import { 
  Search, 
  Video, 
  Mic, 
  Rocket, 
  Menu, 
  X, 
  Newspaper, 
  Headphones, 
  Bookmark, 
  Sparkles 
} from 'lucide-react';
import logo from "../Pic/header.png";

interface NavbarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView, param?: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenDailyEdit: () => void;
  onOpenContact?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  savedCount,
  onOpenSaved,
  onOpenDailyEdit,
  onOpenContact,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    return localStorage.getItem('nextake_custom_logo') || logo;
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      const customLogo = localStorage.getItem('nextake_custom_logo');
      setLogoSrc(customLogo || logo);
    };

    window.addEventListener('nextake_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('nextake_logo_updated', handleLogoUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#070b10] border-b border-[#1f2937] text-white">
      {/* Main Nav Bar */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-left focus:outline-none group relative"
            id="brand-logo-btn"
            title="NexTake Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
              <img
                src={logoSrc}
                alt="Brand Logo"
                className="h-auto w-auto max-h-10 sm:max-h-12 object-contain transition-all duration-200"
              />
            </span>
          </button>
        </div>

        {/* Right Side: Navigation Links & CTA Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex items-stretch lg:items-center gap-1 flex-col lg:flex-row absolute lg:static top-full left-0 right-0 z-50 p-3 lg:p-0 bg-[#070b10] lg:bg-transparent border-b border-[#1f2937] lg:border-0 shadow-xl lg:shadow-none`}
            id="nav-links-right"
          >
            {/* Home Link */}
            <button
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'home' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto text-left`}
            >
              Home
            </button>

            {/* News / Tech Stories */}
            <button
            onClick={() => { onNavigate('explore'); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === ('news' as ScreenView) ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Latest</span>
            </button>

            {/* Videos */}
            <button
              onClick={() => { onNavigate('shorts'); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'shorts' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>

            {/* Interviews */}
            <button
              onClick={() => { onNavigate('interview'); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'interview' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Interviews</span>
            </button>

            {/* Podcasts */}
            <button
              onClick={() => { onNavigate('podcasts' as ScreenView); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === ('podcasts' as ScreenView) ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Podcasts</span>
            </button>

            {/* Startups */}
            <button
              onClick={() => { onNavigate('startups'); setIsMenuOpen(false); }}
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'startups' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Startups</span>
            </button>

            {/* Daily Edit / AI Digest */}
            <button
              onClick={() => { onOpenDailyEdit(); setIsMenuOpen(false); }}
              className="px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 hover:bg-white/5 w-full lg:w-auto justify-start text-left"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>News Letter</span>
            </button>

            {/* Explore / Search */}
            <button
              onClick={() => { onNavigate('explore'); setIsMenuOpen(false); }}
              aria-label="Explore"
              className={`px-2.5 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'explore' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              } w-full lg:w-auto justify-start text-left`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Events</span>
              {/* <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700 hidden xl:inline">⌘K</span> */}
            </button>
          </nav>

          {/* Bookmarks / Saved Posts */}
          <button
            onClick={onOpenSaved}
            aria-label="Saved articles"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded transition-colors flex items-center justify-center"
            title="Saved Articles"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#070b10]">
                {savedCount > 99 ? '99+' : savedCount}
              </span>
            )}
          </button>

          {/* Contact Us Pill */}
          <button
            onClick={onOpenContact}
            id="contact-us-btn"
            className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider rounded bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 transition-all shadow-[0_0_15px_rgba(0,242,170,0.3)] hover:shadow-[0_0_20px_rgba(0,242,170,0.5)] active:scale-95"
          >
            Contact
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex size-9 items-center justify-center rounded border border-slate-700 text-slate-200 hover:bg-white/5"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="nav-links-right"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};