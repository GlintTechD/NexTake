import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import {
  X,
  Send,
  CheckCircle2,
  Shield,
  Mail,
  MessageSquare,
  Building,
  User,
} from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InquiryType = "editorial" | "tip" | "press" | "corporate";

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [inquiryType, setInquiryType] = useState<InquiryType>("editorial");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSending(true);
    setError("");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setError("Unable to send your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

 const handleReset = () => {
  setIsSubmitted(false);
  setIsSending(false);
  setError("");
  setName("");
  setEmail("");
  setOrganization("");
  setMessage("");
  setInquiryType("editorial");
  onClose();
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      id="contact-modal-overlay"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="contact-modal-dialog"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider">
              NexTake • Direct Desk
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close Contact Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dispatch Transmitted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out to NexTake. Your inquiry has been
              routed to our{" "}
              <span className="text-emerald-700 font-mono font-semibold">
                {inquiryType === "tip"
                  ? "secure investigative desk"
                  : inquiryType === "editorial"
                    ? "editorial board"
                    : inquiryType === "press"
                      ? "communications team"
                      : "partnerships director"}
              </span>
              . You will receive an acknowledgment within one business cycle.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs tracking-wider transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-5 bg-white"
          >
            <input type="hidden" name="inquiry_type" value={inquiryType} />
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Contact Us
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Direct lines for story pitches, secure whistleblower tips, press
                inquiries, and corporate partnerships.
              </p>
            </div>

            {/* Inquiry Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                Inquiry Routing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "editorial", label: "Editorial" },
                  { id: "tip", label: "Leak / Tip" },
                  { id: "press", label: "Press Desk" },
                  { id: "corporate", label: "Partnership" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInquiryType(tab.id as InquiryType)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border text-center transition-all ${
                      inquiryType === tab.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-semibold text-slate-700">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-semibold text-slate-700">
                  Work / Signal Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-semibold text-slate-700">
                Organization / Affiliation
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={organization}
                  name="organization"
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Autonomous Labs / University / Fund"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-semibold text-slate-700">
                Message / Brief *
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  required
                  rows={3}
                  value={message}
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    inquiryType === "tip"
                      ? "Share encrypted tip details, verification hashes, or document references..."
                      : "Outline your question, story lead, or partnership proposal..."
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all"
                ></textarea>
              </div>
            </div>

            {inquiryType === "tip" && (
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  All leak dispatches are cryptographically isolated and
                  stripped of telemetry.
                </span>
              </div>
            )}

            {error && (
  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
    {error}
  </div>
)}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-500">
                Encrypted submission • Response &lt; 24h
              </span>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono font-bold text-xs tracking-wider flex items-center space-x-2 transition-all shadow-sm active:scale-95"
              >
                <span>{isSending ? "Transmitting..." : "Transmit"}</span>

                <Send
                  className={`w-3.5 h-3.5 ${isSending ? "animate-pulse" : ""}`}
                />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
