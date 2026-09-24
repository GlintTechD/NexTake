import React from 'react';
import { ScreenView } from '../types';
import { Search, Bookmark, Check, Shield, Bell, User } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 bg-[#070b10] border-b border-[#1f2937] text-white">
      {/* Main Nav Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-left focus:outline-none group"
            id="brand-logo-btn"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors w-30">
             <img src="/nextake-logo-transparent.png" alt="NextTake — Technology News. Intelligently Curated." className="w-full h-auto bg-transparent" />
            </span>
          </button>
        </div>

        {/* Right Side: Navigation Links & CTA Area */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-1 sm:space-x-2" id="nav-links-right">
            <button
              onClick={() => onNavigate('home')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'home' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => onNavigate('shorts')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'shorts' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span>Shorts</span>
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors flex items-center space-x-1.5 ${
                currentScreen === 'explore' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700 hidden md:inline">⌘K</span>
            </button>
          </nav>

          {/* Contact Us Pill */}
          <button
            onClick={onOpenContact}
            id="contact-us-btn"
            className="px-3.5 sm:px-4 py-1.5 text-xs font-mono font-bold tracking-wider rounded bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 transition-all shadow-[0_0_15px_rgba(0,242,170,0.3)] hover:shadow-[0_0_20px_rgba(0,242,170,0.5)] active:scale-95"
          >
            Contact Us
          </button>
        </div>
      </div>
    </header>
  );
};
