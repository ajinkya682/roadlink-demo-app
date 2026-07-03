import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Flashlight, Image as ImageIcon } from 'lucide-react';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { NativeFeedback } from '../../hooks/useNative';

export default function QRScanner() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let scanListener = null;

    const startNativeScanner = async () => {
      if (!Capacitor.isNativePlatform()) {
        console.warn('Camera is only supported on native devices via Capacitor.');
        // Simulate successful scan on web
        setTimeout(() => handleScanSuccess('SIMULATED_QR'), 3500);
        return;
      }

      try {
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera === 'granted' || camera === 'limited') {
          setHasPermission(true);
          
          // Make background transparent for capacitor to show camera beneath
          document.body.style.backgroundColor = 'transparent';
          document.documentElement.style.backgroundColor = 'transparent';
          
          await BarcodeScanner.startScan({ lensFacing: LensFacing.Back });

          scanListener = await BarcodeScanner.addListener('barcodeScanned', async (result) => {
            if (result.barcode) {
              await handleScanSuccess(result.barcode.rawValue);
            }
          });
        }
      } catch (err) {
        console.error("Camera access denied or unavailable:", err);
      }
    };

    startNativeScanner();

    return () => {
      if (Capacitor.isNativePlatform()) {
        BarcodeScanner.stopScan();
        if (scanListener) scanListener.remove();
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
      }
    };
  }, []);

  const handleScanSuccess = async (value) => {
    if (scanned) return;
    setScanned(true);
    await NativeFeedback.vibrateSuccess();
    
    if (Capacitor.isNativePlatform()) {
      await BarcodeScanner.stopScan();
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    }
    
    setTimeout(() => {
      navigate('/scan-landing');
    }, 500);
  };

  const toggleTorch = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      if (isTorchOn) {
        await BarcodeScanner.disableTorch();
      } else {
        await BarcodeScanner.enableTorch();
      }
      setIsTorchOn(!isTorchOn);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden flex flex-col ${Capacitor.isNativePlatform() ? 'bg-transparent' : 'bg-[#1c1b1b]'}`}>
      {/* ── HEADER ── */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
        >
          <X size={24} />
        </button>
        <p className="font-display text-white font-semibold text-[16px] tracking-wide shadow-black drop-shadow-md">
          Scan QR Code
        </p>
        <div className="w-10" /> {/* Spacer for centering */}
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
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl shadow-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl shadow-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl shadow-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl shadow-lg" />

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
            <button onClick={toggleTorch} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white group-active:scale-95 transition-transform ${isTorchOn ? 'bg-white text-black' : 'bg-white/10'}`}>
                <Flashlight size={24} className={isTorchOn ? "text-black" : "text-white"} />
              </div>
              <span className="text-white text-xs font-body font-medium">Flashlight</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
