import React, { useState } from 'react';
import { ScreenView } from '../types';
import { FEATURED_INTERVIEW } from '../data/mockData';
import {
  Play,
  Pause,
  Bookmark,
  Share2,
  FileText,
  Headphones,
  Maximize2,
  Volume2,
  Search,
  Download,
  ArrowRight,
  ExternalLink,
  Check,
  Plus,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x'>('1.25x');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(3); // 19:40
  const [currentSecond, setCurrentSecond] = useState(1128); // 18:48
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [isFollowingCompany, setIsFollowingCompany] = useState(false);
  const [isFollowingOperator, setIsFollowingOperator] = useState(false);
  const [audioMode, setAudioMode] = useState(false);

  const isSaved = savedIds.includes(FEATURED_INTERVIEW.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChapterClick = (idx: number, secs: number) => {
    setCurrentChapterIndex(idx);
    setCurrentSecond(secs);
    setIsPlaying(true);
  };

  const filteredTranscript = FEATURED_INTERVIEW.transcript.filter((item) => {
    if (!transcriptSearch.trim()) return true;
    const query = transcriptSearch.toLowerCase();
    return (
      item.text.toLowerCase().includes(query) ||
      item.speaker.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white text-slate-900 pb-20">
      {/* 1. Top Meta Header & Actions Bar (matching 8.png) */}
      <section className="border-b border-slate-200 bg-[#f8fafc] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 pb-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>• The Edit • In-Depth Interviews • Episode #42 • Autonomous Computing</span>
            </div>
            <div className="text-slate-400">
              Rec ID: {FEATURED_INTERVIEW.recId} • {FEATURED_INTERVIEW.quality} • {FEATURED_INTERVIEW.duration}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 leading-tight mb-4">
            {FEATURED_INTERVIEW.title}
          </h1>

          {/* Guest and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs font-mono">
            <div className="space-y-0.5 text-slate-600">
              <div>
                <span className="font-bold text-slate-900">Guest:</span> {FEATURED_INTERVIEW.guest.name} — {FEATURED_INTERVIEW.guest.role}, {FEATURED_INTERVIEW.guest.company}
              </div>
              <div className="text-[11px] text-slate-400">
                Host: {FEATURED_INTERVIEW.host.name} [{FEATURED_INTERVIEW.host.role}] • Recorded at {FEATURED_INTERVIEW.recordedLocation} • {FEATURED_INTERVIEW.recordedDate}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleSave(FEATURED_INTERVIEW.id)}
                className={`px-3 py-1.5 rounded border text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{isSaved ? 'Saved' : 'Save video'}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Interview link copied.');
                }}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('transcript-archive');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read transcript</span>
              </button>

              <button
                onClick={() => setAudioMode((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors ${
                  audioMode
                    ? 'bg-slate-950 text-white'
                    : 'bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 shadow-sm'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{audioMode ? 'Audio playing' : 'Audio dispatch (MP3)'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Primary 4K Video Player Stage (matching 8.png) */}
      <section className="bg-[#070b10] border-b border-slate-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-video max-h-[620px] mx-auto flex flex-col justify-between">
            {/* Background Video Poster / Frame */}
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
              alt="Dario Amodei Next Edit Interview"
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none"></div>

            {/* Top Raw Dispatch HUD Overlay */}
            <div className="relative z-10 p-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white font-bold">Next Edit • Raw 4K Dispatch</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400">Rec 2160p 60fps</span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800">
                  Dario Amodei | CEO, Anthropic
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-emerald-400">
                  Building safe AI
                </span>
              </div>
            </div>

            {/* Center Play Button Overlay */}
            <div
              onClick={() => setIsPlaying((prev) => !prev)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-black/40 text-white opacity-0 hover:opacity-100'
                    : 'bg-[#00f2aa] text-slate-950 shadow-[0_0_30px_rgba(0,242,170,0.5)] scale-100 hover:scale-105'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-9 h-9 fill-current ml-1" />
                )}
              </div>
            </div>

            {/* Bottom Scrubber & Controls Bar (matching 8.png) */}
            <div className="relative z-10 bg-black/80 backdrop-blur-md border-t border-slate-800 p-3 sm:p-4 space-y-2">
              {/* Timeline Track */}
              <div
                className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  setCurrentSecond(Math.floor(ratio * 2900));
                }}
              >
                <div
                  className="bg-[#00f2aa] h-full transition-all"
                  style={{ width: `${(currentSecond / 2900) * 100}%` }}
                ></div>
              </div>

              {/* Controls and Soundwave Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="text-white hover:text-emerald-400"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <span className="text-slate-300">
                    {formatTime(currentSecond)} / 48:20
                  </span>

                  <span className="text-slate-600">|</span>

                  {/* Chapter Pill */}
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[11px] truncate max-w-xs border border-slate-700">
                    Ch {currentChapterIndex + 1}: {FEATURED_INTERVIEW.chapters[currentChapterIndex]?.title}
                  </span>
                </div>

                {/* Simulated Audio Spectrum Wave */}
                <div className="hidden md:flex items-center space-x-0.5 text-emerald-400/80">
                  <span className="text-[10px] text-slate-500 mr-2">Signal level</span>
                  {[3, 8, 14, 20, 16, 9, 4, 12, 18, 22, 14, 6, 10, 18, 12, 5].map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-emerald-400 rounded-full inline-block transition-all"
                      style={{
                        height: isPlaying ? `${Math.max(4, h + Math.sin(i + currentSecond) * 6)}px` : '4px',
                      }}
                    ></span>
                  ))}
                </div>

                {/* Speed & Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px]">Speed</span>
                  {(['1.0x', '1.25x', '1.5x'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        playbackSpeed === spd
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white bg-slate-900'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}

                  <Volume2 className="w-4 h-4 text-slate-400 ml-2" />
                  <Maximize2 className="w-4 h-4 text-slate-400 ml-1 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Article Narrative + Transcript + Connected Intelligence (matching 8.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Executive Brief */}
            <div>
              <div className="text-xs font-mono text-slate-400 tracking-wider font-bold mb-1">
                Executive brief
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-4">
                The Architectural Shift From Static Pre-Training to Live Synthesis Engines
              </h2>

              <div className="space-y-4 font-editorial text-lg text-slate-800 leading-[1.8]">
                {FEATURED_INTERVIEW.executiveBrief.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Highlighted Quote Callout */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 font-sans">
              <div className="text-[10px] font-mono text-emerald-700 font-bold tracking-wider mb-2">
                Primary directive
              </div>
              <blockquote className="text-base sm:text-lg font-medium italic text-slate-950 leading-relaxed mb-3">
                "{FEATURED_INTERVIEW.quote.text}"
              </blockquote>
              <div className="text-xs font-mono text-slate-500">
                — Dario Amodei [{FEATURED_INTERVIEW.quote.timestamp}]
              </div>
            </div>

            <p className="font-editorial text-lg text-slate-800 leading-[1.8]">
              Furthermore, Elena Vance presses Amodei on the macroeconomic dependencies of sovereign compute clusters, the viability of proprietary synthetic dataset generation, and whether the silicon supply chain can sustain the 10x per-annum training demands projected through 2028.
            </p>

            {/* Key Moments & Chapter Timestamps (matching 8.png) */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 mb-4 border-b border-slate-200">
                <span className="font-bold text-slate-900">
                  Telemetry index • Key moments & chapter timestamps
                </span>
                <span>7 indexed segments</span>
              </div>

              <div className="space-y-3 font-mono">
                {FEATURED_INTERVIEW.chapters.map((ch, idx) => {
                  const isCurrent = currentChapterIndex === idx;
                  return (
                    <div
                      key={ch.time}
                      onClick={() => handleChapterClick(idx, ch.seconds)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-slate-950 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {ch.time}
                        </span>

                        <div>
                          <div className="text-xs font-bold leading-snug">
                            {ch.title}
                            {isCurrent && (
                              <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                                Currently playing
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 leading-relaxed font-sans ${
                              isCurrent ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {ch.description}
                          </div>
                        </div>
                      </div>

                      <Play
                        className={`w-4 h-4 shrink-0 ml-3 ${
                          isCurrent
                            ? 'text-emerald-400 fill-current'
                            : 'text-slate-300 group-hover:text-slate-600'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verbatim Transcript Highlights (matching 8.png) */}
            <div id="transcript-archive" className="pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2 font-mono text-xs">
                <span className="font-bold text-slate-900">
                  Record • Archive • Verbatim transcript highlights
                </span>
                <button
                  onClick={() => alert('Exporting raw encrypted transcript file: DISPATCH-EP42-RAW.TXT')}
                  className="text-slate-500 hover:text-slate-900 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .txt</span>
                </button>
              </div>

              {/* Search Bar for Transcript */}
              <div className="relative mb-6">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search within transcript: (e.g. 'Constitutional', 'Synthesis', 'Sovereign')..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Transcript dialogues */}
              <div className="space-y-4 font-sans text-sm">
                {filteredTranscript.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      t.highlighted
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-950">{t.speaker}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{t.role}</span>
                      </div>
                      <span className="text-emerald-700 font-bold">[{t.time}]</span>
                    </div>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Connected Intelligence (4 cols, matching 8.png) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="font-mono text-xs pb-2 border-b border-slate-200">
              <span className="text-slate-400 font-bold">
                Ecosystem graph
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Connected Intelligence
              </h3>
            </div>

            {/* Connected Short Card */}
            <div
              onClick={() => onNavigate('shorts')}
              className="rounded-xl overflow-hidden bg-[#090d14] text-white border border-slate-800 p-4 group cursor-pointer"
            >
              <div className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 mb-2">
                <Play className="w-3 h-3 fill-current" />
                <span>Tech short • 0:52</span>
              </div>

              <div className="aspect-[16/9] bg-slate-800 rounded overflow-hidden mb-3 relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Dario Short"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                />
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                Dario Amodei on why code generation is essentially solved
              </h4>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                "Writing syntax is the easy part. The barrier was always multi-file context and recursive proof."
              </p>

              <div className="flex items-center space-x-1 text-xs font-mono font-bold text-emerald-400 group-hover:underline">
                <span>Watch short</span>
                <span>↗</span>
              </div>
            </div>

            {/* Related Investigative Dispatch */}
            <div
              onClick={() => onNavigate('article', 'dispatch-842')}
              className="bg-white rounded-xl border border-slate-200 p-4 group cursor-pointer hover:border-slate-400 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="text-emerald-700 font-bold">Investigative dispatch</span>
                <span>6 min read</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
                Anthropic & DeepMind Architect Autonomous Model Synthesizers for Cloud Infrastructure
              </h4>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                An analysis of the closed-door consortia establishing the next protocol standard for self-modifying software pipelines.
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                <span>Oct 24, 2025</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <span>Read story</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Company Dossier: Anthropic PBC */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">
                  Company dossier
                </span>
                <button
                  onClick={() => setIsFollowingCompany((prev) => !prev)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                    isFollowingCompany
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isFollowingCompany ? 'Following ✓' : 'Follow +'}
                </button>
              </div>

              <h4 className="text-xs font-bold text-slate-950">Anthropic, PBC</h4>

              <div className="grid grid-cols-2 gap-2 my-2 text-[10px] font-mono bg-slate-50 p-2 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400">Valuation</span>
                  <div className="font-bold text-slate-900">$18.4B USD</div>
                </div>
                <div>
                  <span className="text-slate-400">Dispatches</span>
                  <div className="font-bold text-slate-900">14 Published</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Signal Index: High Velocity</span>
                <span className="text-emerald-600 font-bold">94/100</span>
              </div>
            </div>

            {/* Operator: Dario Amodei */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <img
                  src={FEATURED_INTERVIEW.guest.avatar}
                  alt="Dario"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900">Dario Amodei</h4>
                  <p className="text-[10px] text-slate-500">
                    Co-Founder & CEO, Anthropic
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFollowingOperator((prev) => !prev)}
                className={`ml-2 px-2.5 py-1 text-[10px] font-mono font-bold rounded transition-colors ${
                  isFollowingOperator
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isFollowingOperator ? 'Following ✓' : 'Follow +'}
              </button>
            </div>

            {/* Author Archive: More from Dario Amodei */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold block">
                Author archive / More from Dario Amodei on Next Edit
              </span>

              <div className="space-y-2 text-[11px]">
                <div className="cursor-pointer hover:text-emerald-700">
                  <div className="text-[9px] text-slate-400">June 2025 • Essay / Monograph</div>
                  <div className="font-bold text-slate-900 leading-snug">
                    Machines of Grace: The 2030 Projections for Frontier AI in Medicine & Material Science
                  </div>
                </div>

                <div className="cursor-pointer hover:text-emerald-700 pt-2 border-t border-slate-200">
                  <div className="text-[9px] text-slate-400">January 2025 • Interview #24</div>
                  <div className="font-bold text-slate-900 leading-snug">
                    The Safety Compute Dilemma: Can Guardrails Keep Pace with Exascale Training?
                  </div>
                </div>

                <div className="cursor-pointer hover:text-emerald-700 pt-2 border-t border-slate-200">
                  <div className="text-[9px] text-slate-400">September 2024 • Panel discussion</div>
                  <div className="font-bold text-slate-900 leading-snug">
                    The White House Executive AI Order: One Year in the Field with AI Founders
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Topic Channels */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold block">
                Telemetry topic channels
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['#Ai-Compute', '#Autonomous-Agents', '#Constitutional-Alignment', '#Sovereign-Clusters'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => onNavigate('explore', tag.replace('#', ''))}
                      className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[10px] hover:bg-slate-200"
                    >
                      {tag} +
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Newsletter Briefing Callout (matching 8.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#090d14] text-white rounded-xl p-8 border border-slate-800">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              Telemetry wire • Daily 06:00 UTC
            </span>
            <h3 className="text-2xl font-black">
              Stay ahead of what's next
            </h3>
            <p className="text-xs text-slate-400">
              The global technology landscape moves too fast for reactive newsfeeds. Receive the unredacted executive dossiers, algorithmic audits, and deep interview monographs before they reach public wires.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <input
                type="email"
                placeholder="corporate.email@organization.com"
                className="px-3.5 py-2.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 flex-grow"
              />
              <button
                onClick={() => alert('Subscribed to Next Edit Telemetry Wire.')}
                className="px-5 py-2.5 rounded bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider shrink-0 transition-colors"
              >
                Synchronize dispatch
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Zero sponsored content. Strictly analytical intelligence. Unsubscribe at any time.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
