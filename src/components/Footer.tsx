import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import logo from "../Pic/Logo.png";

interface FooterProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  onOpenDailyEdit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDailyEdit }) => {
  const [footerLogo, setFooterLogo] = useState<string>(() => {
    return localStorage.getItem('nextake_custom_logo') || logo;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const custom = localStorage.getItem('nextake_custom_logo');
      setFooterLogo(custom || logo);
    };
    window.addEventListener('nextake_logo_updated', handleUpdate);
    return () => window.removeEventListener('nextake_logo_updated', handleUpdate);
  }, []);

  return (
    <footer className="bg-[#05080c] text-slate-400 text-xs border-t border-[#161f2c] pt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-[#161f2c]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center bg-transparent p-0">
              <img
                src={footerLogo}

                alt="NextTake — Technology News. Intelligently Curated."
                className="h-20 w-auto max-w-[340px] object-contain sm:h-24 sm:max-w-[420px] lg:max-w-[460px] drop-shadow-[0_0_20px_rgba(34,211,238,0.22)] bg-transparent"
              />
            </div>

            <div className="font-mono text-[14px] sm:text-[16px] leading-relaxed text-emerald-400 space-y-2 font-black tracking-[0.08em]">
              <p className="text-emerald-300">WHAT IS HAPPENING?</p>
              <p className="text-emerald-300">WHAT IS NEXT?</p>
              <p className="text-emerald-300">WHAT SHOULD I KNOW?</p>
            </div>

            <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-sm font-extrabold tracking-[0.01em]">
              High-signal investigative technology analysis engineered for global operators, research minds, and builders.
            </p>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-white font-mono text-[11px] tracking-wider font-bold mb-3.5">
              Categories
            </h4>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <button
                  onClick={() => onNavigate('explore', 'AI')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  AI & Neural Networks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'FINTECH')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Fintech & Sovereign Rails
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'STARTUPS')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Venture & Seed Capital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'CYBERSECURITY')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Cybersecurity & Threat Mesh
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore', 'ROBOTICS')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Autonomous Robotics
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial Col */}
          <div>
            <h4 className="text-white font-mono text-[11px] tracking-wider font-bold mb-3.5">
              Editorial
            </h4>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Trending Signals
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDailyEdit}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  The Daily Edit Brief
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shorts')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Video & Tech Reels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('startups')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Startups & Unicorn Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('interview')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Operator Interviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('article')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Deep Dive Monographs
                </button>
              </li>
            </ul>
          </div>

          {/* Retention & Feeds */}
          <div>
            <h4 className="text-white font-mono text-[11px] tracking-wider font-bold mb-3.5">
              Retention & Feeds
            </h4>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <button
                  onClick={onOpenDailyEdit}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Newsletter Subscription
                </button>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Syndicated RSS Feeds</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Telegram Telemetry Wire</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Audio Monographs Podcast</span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">Custom Dispatch Alerts</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-mono text-[11px] tracking-wider font-bold mb-3.5">
              Follow Us
            </h4>
            <ul className="space-y-2.5 text-[12px]">
              <li>
                <a
                  href="https://www.tiktok.com/@nextakeafrica?_r=1&_t=ZS-99whwf9jCeg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-slate-300">TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/nextakeafrica?s=11"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-slate-300">X</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@nextakeafrica?si=C4kBMGS9lWiCJ3uV"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-slate-300">YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/nextake-africa-45ab02439"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-slate-300">LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/nextakeafrica?stkn=OXNzeTQ0NXY4azRq"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-2"
                >
                  <span className="text-slate-300">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & system telemetry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-start font-mono text-[11px] text-slate-500 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>© 2026 NexTake Media Group. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
