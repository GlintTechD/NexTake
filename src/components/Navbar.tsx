import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import logo from "../Pic/Logo.png";

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
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    return localStorage.getItem('nextake_custom_logo') || logo;
  });
  const [logoWidth, setLogoWidth] = useState<number>(() => {
    const saved = localStorage.getItem('nextake_logo_width');
    return saved ? Number(saved) : 180;
  });
  const [logoHeight, setLogoHeight] = useState<number>(() => {
    const saved = localStorage.getItem('nextake_logo_height');
    return saved ? Number(saved) : 60;
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      const customLogo = localStorage.getItem('nextake_custom_logo');
      const savedWidth = localStorage.getItem('nextake_logo_width');
      const savedHeight = localStorage.getItem('nextake_logo_height');

      setLogoSrc(customLogo || logo);
      if (savedWidth) setLogoWidth(Number(savedWidth));
      if (savedHeight) setLogoHeight(Number(savedHeight));
    };

    window.addEventListener('nextake_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('nextake_logo_updated', handleLogoUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#070b10] border-b border-[#1f2937] text-white">
      {/* Main Nav Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
                className="object-contain transition-all duration-200"
              />
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
              Home
            </button>
            <button
              onClick={() => onNavigate('shorts')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'shorts' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Video
            </button>
            <button
              onClick={() => onNavigate('interview')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'interview' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Interviews
            </button>
            <button
              onClick={() => onNavigate('startups')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'startups' || currentScreen === 'startup-article' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Startups
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono tracking-wider font-semibold rounded transition-colors ${
                currentScreen === 'explore' ? 'text-emerald-400 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Explore
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
