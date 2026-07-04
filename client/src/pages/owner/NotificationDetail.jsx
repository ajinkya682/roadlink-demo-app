import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Navigation, Check, AlertTriangle, ShieldAlert, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlateTag from '../../components/PlateTag';
import Button from '../../components/Button';
import { useAppData } from '../../context/AppContext';

export default function NotificationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { notifications, markResolved } = useAppData();

  const notif = notifications.find(n => n.id === id) || notifications[0];
  const [resolved, setResolved] = useState(notif?.resolved || false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleResolve = () => {
    setResolved(true);
    markResolved(notif.id);
    setTimeout(() => navigate(-1), 1000);
  };

  if (!notif) return null;

  return (
    <>
      <div className="min-h-screen bg-[#F7F8FA] font-body text-[#1c1b1b] pb-10">
        <header className="px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-all">
            <ArrowLeft size={24} />
          </button>
        </header>

        <main className="max-w-2xl mx-auto px-4 space-y-6">
          
          {/* Header Block */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                notif.isAlert ? 'bg-[#ba1a1a] text-white' : 'bg-[#1b4b8f] text-white'
              }`}>
                {notif.isAlert ? <AlertTriangle size={14} /> : null}
                {notif.isAlert ? 'EMERGENCY: THEFT' : 'ALERT'}
              </div>
              <span className="text-[14px] text-[#737782] font-medium flex items-center gap-1">
                🕒 {notif.time}
              </span>
            </div>

            <h1 className="font-display text-[26px] font-bold text-[#1c1b1b] leading-tight mb-4">
              {notif.isAlert ? 'Attempted Unauthorized Access' : notif.type}
            </h1>

            <div className="mb-6">
              <PlateTag plateNumber={notif.plate} size="lg" />
            </div>
          </div>

          {/* Media / CCTV Image */}
          {notif.mediaUrls && notif.mediaUrls.length > 0 ? (
            <div 
              className="rounded-2xl overflow-hidden border border-[#1c1b1b]/10 shadow-sm relative bg-black cursor-pointer"
              onClick={() => setIsImageOpen(true)}
            >
              {/* Fake Camera Overlay */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <span className="bg-[#ba1a1a] text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  SEC-CAM-09 // BREACH_DETECTED
                </span>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <span className="text-white/80 text-[10px] font-mono">CAM 7</span>
              </div>
              <img 
                src={notif.mediaUrls[0]} 
                alt="Security Feed" 
                className="w-full h-[220px] object-cover opacity-90"
              />
            </div>
          ) : notif.isAlert ? (
            <div className="rounded-2xl overflow-hidden border border-[#1c1b1b]/10 shadow-sm relative bg-[#1c1b1b] h-[220px] flex flex-col items-center justify-center">
              <ShieldAlert size={48} className="text-[#ba1a1a] mb-2 opacity-80" />
              <p className="text-white/60 font-mono text-[12px]">NO CAMERA FEED AVAILABLE</p>
            </div>
          ) : null}

          {/* Location Block */}
          {notif.reporterLocation ? (
            <div className="bg-white rounded-2xl border border-[#1c1b1b]/10 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Last Known Location</p>
                <h3 className="font-display text-[18px] font-semibold text-[#1c1b1b] flex items-center gap-2">
                  User Shared Location <MapPin size={18} className="text-[#1b4b8f]" />
                </h3>
              </div>
              <a
                href={`https://maps.google.com/?q=${notif.reporterLocation.lat},${notif.reporterLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#f0eded] flex items-center justify-center text-[#1b4b8f] hover:bg-[#eae7e7] transition-colors"
              >
                <Navigation size={20} />
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#1c1b1b]/10 shadow-sm p-5 flex items-center justify-between">
               <div>
                <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-1">Location Data</p>
                <h3 className="font-display text-[16px] font-semibold text-[#737782]">
                  Location not provided
                </h3>
              </div>
            </div>
          )}

          {/* Notes / Security Event Log */}
          <div className="bg-white rounded-2xl border border-[#1c1b1b]/10 shadow-sm p-5">
             <p className="text-[11px] font-bold text-[#737782] tracking-widest uppercase mb-4 border-b border-[#1c1b1b]/10 pb-3">
               {notif.isAlert ? 'Security Event Log' : 'Report Details'}
             </p>
             
             {notif.isAlert ? (
               <div className="space-y-4">
                 <div className="flex gap-4">
                   <span className="font-mono text-[12px] text-[#737782] w-16 pt-0.5">Alert</span>
                   <div>
                     <p className="font-semibold text-[#ba1a1a] text-[14px]">System Triggered</p>
                     <p className="text-[#434751] text-[14px]">User submitted emergency report.</p>
                   </div>
                 </div>
                 {notif.notes && (
                   <div className="flex gap-4">
                     <span className="font-mono text-[12px] text-[#737782] w-16 pt-0.5">Notes</span>
                     <div>
                       <p className="font-semibold text-[#1c1b1b] text-[14px]">Reporter Notes</p>
                       <p className="text-[#434751] text-[14px] italic">"{notif.notes}"</p>
                     </div>
                   </div>
                 )}
               </div>
             ) : (
               <p className="text-[#434751] text-[15px] leading-relaxed">
                 {notif.notes ? `"${notif.notes}"` : 'No additional notes provided by the reporter.'}
               </p>
             )}
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-3">
            {notif.isAlert && (
              <a href="tel:100" className="w-full py-4 bg-[#ba1a1a] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#93000a] transition-colors">
                 Call Police (100)
              </a>
            )}
            
            <Button
              fullWidth
              onClick={handleResolve}
              variant={resolved ? 'ghost' : 'outline'}
              className={resolved
                ? 'border-2 border-[#005834] text-[#005834] bg-[#90f7ba]/10'
                : 'border-2 border-[#1c1b1b]/20 text-[#1c1b1b]'
              }
            >
              {resolved ? <><Check size={18} /> Marked as Resolved</> : 'Mark as Resolved'}
            </Button>
          </div>

        </main>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {isImageOpen && notif.mediaUrls && notif.mediaUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          >
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setIsImageOpen(false)}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                src={notif.mediaUrls[0]}
                alt="Security Feed Full"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
