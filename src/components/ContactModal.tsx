import React, { useRef, useState } from "react";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          organization: "",
          inquiryType,
          message,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Unable to send your message. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Contact Form Error:", err);
      setError(err instanceof Error ? err.message : "Unable to send your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

 const handleReset = () => {
  setIsSubmitted(false);
  setIsSending(false);
  setError("");
  setFirstName("");
  setLastName("");
  setEmail("");
  setPhone("");
  setMessage("");
  setInquiryType("editorial");
  onClose();
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      id="contact-modal-overlay"
      onClick={handleReset}
    >
      <div
        className="relative w-full max-w-xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="contact-modal-dialog"
      >
        <button onClick={handleReset} className="absolute right-4 top-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Close Contact Modal"><X className="w-5 h-5" /></button>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Dispatch Transmitted
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out to Next Edit. Your inquiry has been
              routed to our{" "}
              <span className="text-emerald-700 font-mono font-semibold">
                {inquiryType === "tip"
                  ? "editorial tips inbox"
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
            className="p-7 sm:p-10 space-y-5 bg-white"
          >
            <input type="hidden" name="inquiry_type" value={inquiryType} />
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Contact Us
              </h2>
              <p className="text-xs text-slate-500 mt-1">Send us a message and we&apos;ll get back to you soon.</p>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-semibold text-slate-700">
                  First Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-semibold text-slate-700">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-semibold text-slate-700">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Eg. example@gmail.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-semibold text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Eg. +1 800 000000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all" />
              </div>
            </div>

            <div className="space-y-1"><label className="block text-[11px] font-mono font-semibold text-slate-700">Message *</label><textarea required rows={5} value={message} name="message" onChange={(e) => setMessage(e.target.value)} placeholder="Please enter your comments..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all" /></div>

            {error && (
  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
    {error}
  </div>
)}

            {/* Actions */}
            <div className="flex justify-center pt-2"><button
                type="submit"
                disabled={isSending}
                className="px-8 py-3 rounded-full bg-slate-950 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono font-bold text-xs tracking-wider flex items-center space-x-2 transition-all shadow-sm active:scale-95"
              >
                <span>{isSending ? "Submitting..." : "Submit"}</span>

                <Send
                  className={`w-3.5 h-3.5 ${isSending ? "animate-pulse" : ""}`}
                />
              </button></div>
          </form>
        )}
      </div>
    </div>
  );
};
