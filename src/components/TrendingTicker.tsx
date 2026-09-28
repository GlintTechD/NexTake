import React, { useState, useEffect } from 'react';

export const TrendingTicker: React.FC = () => {
  const [tickerIndex, setTickerIndex] = useState(0);

  const tickerAlerts = [
    '#842 Real-time protocol telemetry: Anthropic & DeepMind release architectural proofs',
    '#841 Global hardware runtimes: TSMC commits 2nm fab access to allied silicon program',
    '#840 SWIFT runtime migration: 14 tier-one clearing houses complete latency overhaul',
    '#839 Regulatory dispatch: EU commissions first autonomous agent auditing framework',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAlerts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickerAlerts.length]);

  return (
    <div className="bg-[#0b1017] text-white border-b border-[#1a2330] py-2 px-4 sm:px-8 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate">
          <span className="flex items-center space-x-2 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span style={{ fontFamily: 'Georgia, serif' }}>• Trending:</span>
          </span>
          <span
            style={{ fontFamily: 'Arial, sans-serif' }}
            className="text-slate-300 truncate font-['Arial',sans-serif]"
          >
            {tickerAlerts[tickerIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
