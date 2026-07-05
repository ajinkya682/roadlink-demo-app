import React from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopAuthButton from '../TopAuthButton';

export default function ScannerControls({ 
  cameras = [], 
  activeCameraId, 
  onSwitchCamera 
}) {
  const navigate = useNavigate();

  // Find index of current camera to switch to next one
  const handleSwitchCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(c => c.deviceId === activeCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    onSwitchCamera(cameras[nextIndex].deviceId);
  };

  return (
    <>
      {/* Top Header Controls */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-5 pointer-events-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <X size={24} />
        </button>
        <p className="font-display text-white font-semibold text-[16px] tracking-wide shadow-black drop-shadow-md">
          Scan QR Code
        </p>
        <div className="flex items-center justify-center">
           <TopAuthButton theme="dark" className="" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 w-full z-20 flex items-center justify-center gap-12 pointer-events-auto">
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-active:scale-95 transition-transform">
            <ImageIcon size={24} />
          </div>
          <span className="text-white text-xs font-body font-medium">Gallery</span>
        </button>
        
        {cameras.length > 1 && (
          <button onClick={handleSwitchCamera} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-active:scale-95 transition-transform">
              <Camera size={24} />
            </div>
            <span className="text-white text-xs font-body font-medium">Switch</span>
          </button>
        )}
      </div>
    </>
  );
}
