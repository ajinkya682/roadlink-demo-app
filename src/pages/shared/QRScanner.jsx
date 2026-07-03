import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Flashlight, Image as ImageIcon } from 'lucide-react';

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const videoRef = useRef(null);

  // Initialize the real device camera
  useEffect(() => {
    let stream = null;
    
    async function startCamera() {
      try {
        // Request the back camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or unavailable:", err);
      }
    }
    
    startCamera();

    // Cleanup: turn off the camera when the user leaves the page
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate a scan after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanned(true);
      setTimeout(() => {
        // After showing success state briefly, navigate to scan landing
        navigate('/scan-landing');
      }, 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-[#1c1b1b] overflow-hidden flex flex-col">
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-5 safe-area-pt">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
        >
          <X size={24} />
        </button>
        <p className="font-display text-white font-semibold text-[16px] tracking-wide">
          Scan QR Code
        </p>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* ── REAL CAMERA FEED ── */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── VIEWFINDER OVERLAY ── */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Top dark area */}
        <div className="flex-1 bg-black/60 backdrop-blur-[2px]" />

        {/* Center cutout area */}
        <div className="flex justify-center">
          <div className="w-[15vw] bg-black/60 backdrop-blur-[2px]" />
          
          {/* The Clear Cutout */}
          <div className="relative w-[70vw] aspect-square">
            {/* 4 Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl" />

            {/* Scanning Laser Line */}
            {!scanned && (
              <motion.div
                className="absolute left-0 w-full h-1 bg-[#1E8E5A] shadow-[0_0_15px_3px_rgba(30,142,90,0.7)]"
                animate={{ top: ['5%', '95%', '5%'] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}

            {/* Success flash */}
            {scanned && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white/80 rounded-2xl"
              />
            )}
          </div>
          
          <div className="w-[15vw] bg-black/60 backdrop-blur-[2px]" />
        </div>

        {/* Bottom dark area */}
        <div className="flex-[1.5] bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-start pt-8 pb-10">
          <p className="text-white/80 font-body text-sm font-medium text-center px-8 mb-10">
            Point your camera at a RoadLink digital identity sticker to scan it.
          </p>

          {/* Controls */}
          <div className="flex items-center gap-12 mt-auto">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-active:scale-95 transition-transform">
                <ImageIcon size={24} />
              </div>
              <span className="text-white text-xs font-body font-medium">Gallery</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-active:scale-95 transition-transform">
                <Flashlight size={24} />
              </div>
              <span className="text-white text-xs font-body font-medium">Flashlight</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
