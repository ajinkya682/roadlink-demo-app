import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck, Globe, Mail, Phone, MessageSquare, MapPin, Wifi, Code, FileText, HelpCircle } from 'lucide-react';
import { QR_TYPES } from '../../lib/qr';
import { NativeFeedback } from '../../hooks/useNative';

const getIcon = (iconName) => {
  const icons = {
    ShieldCheck, Globe, Mail, Phone, MessageSquare, MapPin, Wifi, Code, FileText, HelpCircle, Link: Globe
  };
  const Icon = icons[iconName] || HelpCircle;
  return <Icon size={24} />;
};

export default function ScannerResult({ result, onDismiss }) {
  const [countdown, setCountdown] = useState(3);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (result && (result.type === QR_TYPES.HTTP || result.type === QR_TYPES.HTTPS)) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-open URL logic could go here, but user requirements stated:
            // "Open only after User taps OR 3 second countdown with Cancel button."
            // So we just enable the button state visually if we hit 0.
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [result]);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      NativeFeedback.vibrateSuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleOpen = () => {
    NativeFeedback.vibrateSuccess();
    window.open(result.value, '_blank', 'noopener,noreferrer');
  };

  const isUrl = result.type === QR_TYPES.HTTP || result.type === QR_TYPES.HTTPS;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        className="absolute bottom-0 left-0 w-full z-30 p-4"
      >
        <div className="bg-[#1c1b1b] rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-green/20 text-primary-green flex items-center justify-center shrink-0">
              {getIcon(result.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                {result.label}
              </p>
              <p className="text-white font-body text-base truncate">
                {result.value}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/10 my-2" />

          {/* Actions */}
          <div className="flex gap-3">
            {isUrl ? (
              <>
                <button
                  onClick={onDismiss}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-semibold text-sm active:scale-95 transition-transform"
                >
                  Cancel {countdown > 0 ? `(${countdown})` : ''}
                </button>
                <button
                  onClick={handleOpen}
                  className="flex-[2] py-3.5 rounded-xl bg-primary-green text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_4px_14px_0_rgba(30,142,90,0.39)]"
                >
                  <ExternalLink size={18} />
                  Open Link
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onDismiss}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <RefreshCw size={18} />
                  Scan Again
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3.5 rounded-xl bg-primary-green text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Copy size={18} />
                  {copied ? 'Copied!' : 'Copy Data'}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
