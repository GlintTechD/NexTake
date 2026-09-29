import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  Mail,
  Shield,
} from "lucide-react";
import { getDailyEditSettings } from "../lib/supabase";
import type { DailyEditSettings } from "../lib/supabase";


interface DailyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormatType = "morning" | "telemetry" | "monographs";

export const DailyEditModal: React.FC<DailyEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedFormat, setSelectedFormat] =
    useState<FormatType>("morning");

  const [settings, setSettings] =
    useState<DailyEditSettings | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadSettings = async () => {
      setLoading(true);

      const data = await getDailyEditSettings();

      setSettings(data);
      setLoading(false);
    };

    loadSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);

    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
      onClose();
    }, 2500);
  };

  const editions = [
    {
      id: "morning" as FormatType,
      name: settings?.morning_name,
      description: settings?.morning_description,
    },
    {
      id: "telemetry" as FormatType,
      name: settings?.telemetry_name,
      description: settings?.telemetry_description,
    },
    {
      id: "monographs" as FormatType,
      name: settings?.monographs_name,
      description: settings?.monographs_description,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-[#090d14] border border-slate-800 text-white p-6 sm:p-8 shadow-2xl font-sans">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-400">
              Loading Daily Edit...
            </p>
          </div>
        ) : subscribed ? (
          /* SUCCESS STATE */
          <div className="py-12 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white">
              Dispatch channel synchronized
            </h3>

            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              You will receive the Daily Edit directly at{" "}
              <span className="text-emerald-400">
                {email}
              </span>
              .
            </p>
          </div>
        ) : (
          /* MAIN CONTENT */
          <div className="space-y-6">

            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                <span>
                  {settings?.eyebrow ||
                    "Global editorial wire"}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {settings?.title ||
                  "Get The Daily Edit"}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed">
                {settings?.description ||
                  "High-signal intelligence delivered every morning."}
              </p>

              {settings?.subscriber_text && (
                <p className="text-xs text-emerald-400">
                  {settings.subscriber_text}
                </p>
              )}
            </div>

            {/* Edition Options */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-500 text-[10px] font-bold">
                Select telemetry tier
              </span>

              <div className="grid grid-cols-1 gap-2">
                {editions.map((edition) => {
                  if (!edition.name) return null;

                  return (
                    <button
                      key={edition.id}
                      type="button"
                      onClick={() =>
                        setSelectedFormat(edition.id)
                      }
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedFormat === edition.id
                          ? "bg-emerald-950/40 border-emerald-500 text-white"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span
                          className={
                            selectedFormat === edition.id
                              ? "text-emerald-300"
                              : "text-slate-200"
                          }
                        >
                          {edition.name}
                        </span>

                        {selectedFormat === edition.id && (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>

                      {edition.description && (
                        <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                          {edition.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 font-mono"
            >
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">
                  {settings?.email_label ||
                    "Corporate work email"}
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder={
                      settings?.email_placeholder ||
                      "operator@enterprise.com"
                    }
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#00f2aa] hover:bg-[#00df9c] text-slate-950 font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,242,170,0.3)] active:scale-98"
              >
                {settings?.button_text ||
                  "Subscribe to NexTake telemetry →"}
              </button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-emerald-400" />

                <span>
                  {settings?.privacy_text ||
                    "Archival grade privacy"}
                </span>
              </span>

              <span>
                {settings?.unsubscribe_text ||
                  "Unsubscribe at any moment"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};