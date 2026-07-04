import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Share, CheckCircle, MessageCircle, Camera } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

export default function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const { showAlert } = useDialog();
  const shareUrl = window.location.origin;
  const shareText = "Check out RoadLINK - The digital identity for your vehicles!";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RoadLINK',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      showAlert('Not Supported', "Native sharing isn't supported on this browser.");
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = () => {
    // Instagram doesn't have a direct text-share URL API.
    // We copy the link and prompt the user.
    handleCopy();
    showAlert('Link Copied!', "The link has been copied. You can now paste it in Instagram.");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }} 
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-2xl p-6 relative z-10 shadow-xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-on-surface">Invite Friends</h3>
            <button onClick={onClose} className="p-2 text-on-surface-muted hover:text-navy hover:bg-surface-low rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <p className="font-body text-sm text-on-surface-muted mb-6">
            Share RoadLINK with your friends and family to help them manage their vehicles effortlessly.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={28} />
              </div>
              <span className="font-body text-xs font-semibold text-on-surface">WhatsApp</span>
            </button>
            
            <button onClick={handleInstagram} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] group-hover:bg-[#E1306C]/20 transition-colors">
                <Camera size={28} />
              </div>
              <span className="font-body text-xs font-semibold text-on-surface">Instagram</span>
            </button>

            {!!navigator.share && (
              <button onClick={handleNativeShare} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center text-navy group-hover:bg-navy/20 transition-colors">
                  <Share size={28} />
                </div>
                <span className="font-body text-xs font-semibold text-on-surface">Share Via</span>
              </button>
            )}
            
            <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-outline-light/30 flex items-center justify-center text-on-surface-muted group-hover:bg-outline-light/50 transition-colors">
                {copied ? <CheckCircle size={28} className="text-verified-green" /> : <Link2 size={28} />}
              </div>
              <span className="font-body text-xs font-semibold text-on-surface">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>

          <div className="bg-surface-low rounded-xl p-3 flex items-center gap-3 border border-outline-light">
            <div className="flex-1 truncate font-mono text-xs text-on-surface-muted">
              {shareUrl}
            </div>
            <button 
              onClick={handleCopy}
              className="bg-navy text-white px-4 py-2 rounded-lg font-body text-xs font-bold whitespace-nowrap active:scale-95 transition-transform"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
