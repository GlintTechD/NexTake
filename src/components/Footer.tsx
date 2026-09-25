import React, { useState } from 'react';
import { ScreenView } from '../types';
import { Mail, Shield, ArrowUpRight, MessageSquare, CheckCircle2, Bell, Sparkles, Send } from 'lucide-react';
import logo from "../Pic/Logo.png";

interface FooterProps {
  onNavigate: (screen: ScreenView, param?: string) => void;
  onOpenDailyEdit: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDailyEdit, onOpenContact }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekend' | 'all'>('daily');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/public/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, frequency }),
      });

      if (!response.ok) {
        throw new Error('Unable to save subscription.');
      }

      setIsSubscribed(true);
    } catch (error) {
      console.error('Newsletter subscribe failed:', error);
      setIsSubscribed(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#05080c] text-slate-400 text-xs border-t border-[#161f2c] pt-16 pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* SUBSCRIBE TO NEWSLETTER SECTION */}
        {/* ========================================================================= */}
        <div id="newsletter-subscriber-section" className="mb-12 rounded-2xl bg-gradient-to-br from-[#0a0f18] to-[#070b12] border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-slate-700/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h2 className="max-w-5xl text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-[-0.04em] leading-[0.95] drop-shadow-[0_0_18px_rgba(255,255,255,0.08)] mb-6">
              Subscribe to our daily edit newsletter.
            </h2>

            <div className="w-full max-w-2xl">
              {isSubscribed ? (
                <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      Telemetry Synchronized
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Welcome to The Daily Edit. A confirmation token has been dispatched to{' '}
                      <span className="text-emerald-400 font-mono font-semibold">{email}</span>.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenDailyEdit}
                      className="px-4 py-2 rounded-lg bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider transition-all"
                    >
                      Read Today&apos;s Edition
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubscribed(false);
                        setEmail('');
                      }}
                      className="text-xs text-slate-400 hover:text-white underline font-mono"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3 mx-auto">
                  <div className="relative mx-auto max-w-xl">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full pl-11 pr-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-emerald-400 focus:outline-none text-white placeholder-slate-500 text-xs font-mono transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center mx-auto max-w-xl">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-h-[44px] flex-1 px-6 py-3 rounded-xl bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,242,170,0.25)] hover:shadow-[0_0_25px_rgba(0,242,170,0.4)] active:scale-95 disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span>Synchronizing...</span>
                      ) : (
                        <>
                          <span>Subscribe to Newsletter</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="min-h-[44px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors whitespace-nowrap"
                    >
                      <span>Contact Us</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-500 pt-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                    <span>Zero spam. No tracking pixels. Cryptographic one-click unsubscribe.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-[#161f2c]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center bg-transparent p-0">
              <img
                src={logo}

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
                  Tech Shorts & Reels
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
            <span>© 2025 Next Edit Media Group. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};