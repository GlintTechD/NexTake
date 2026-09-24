import React, { useState } from 'react';
import { X, Check, Mail, Zap, Shield, Sparkles } from 'lucide-react';

interface DailyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyEditModal: React.FC<DailyEditModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'morning' | 'telemetry' | 'monographs'>('morning');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg rounded-2xl bg-[#090d14] border border-slate-800 text-white p-6 sm:p-8 shadow-2xl z-10 font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {subscribed ? (
          <div className="py-12 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">
              Dispatch channel synchronized
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              You will receive the unredacted 07:00 UTC morning intelligence brief directly at <span className="text-emerald-400">{email}</span>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Global editorial wire • Vol. 24</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Get The Daily Edit
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-signal intelligence delivered to 84,000+ technology leaders, principal research scientists, and sovereign investors every morning.
              </p>
            </div>

            {/* Edition Options */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-500 text-[10px] font-bold">
                Select telemetry tier
              </span>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'morning',
                    name: 'The Morning Brief (07:00 UTC)',
                    desc: '5 mission-critical technology developments + rapid market indicators.',
                  },
                  {
                    id: 'telemetry',
                    name: 'Real-Time Protocol Wire',
                    desc: 'Immediate breaking alerts when frontier models, hardware, or exploits trigger thresholds.',
                  },
                  {
                    id: 'monographs',
                    name: 'Weekly Executive Monographs',
                    desc: '14-page whitepaper breakdowns & unedited CEO sit-down transcripts.',
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedFormat(tier.id as any)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedFormat === tier.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={selectedFormat === tier.id ? 'text-emerald-300' : 'text-slate-200'}>
                        {tier.name}
                      </span>
                      {selectedFormat === tier.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                      {tier.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 font-mono">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">
                  Corporate work email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@enterprise.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,242,170,0.3)] active:scale-98"
              >
                Subscribe to Next Edit telemetry →
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Archival grade privacy</span>
              </span>
              <span>Unsubscribe at any moment</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
