import React from 'react';
import { AlertCircle, CameraOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PermissionState({ state, onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-50 bg-[#1c1b1b] flex flex-col items-center justify-center p-6 text-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
      >
        <X size={24} />
      </button>

      <div className="w-20 h-20 rounded-full bg-alert-red/20 text-alert-red flex items-center justify-center mb-6">
        {state === 'UNSUPPORTED' ? <CameraOff size={36} /> : <AlertCircle size={36} />}
      </div>

      <h2 className="text-xl text-white font-display font-semibold mb-3">
        {state === 'DENIED' && 'Camera Access Denied'}
        {state === 'UNSUPPORTED' && 'Camera Not Found'}
        {state === 'REQUESTING' && 'Requesting Camera...'}
      </h2>
      
      <p className="text-white/60 font-body text-sm mb-8 max-w-[280px]">
        {state === 'DENIED' && 'RoadLink needs camera access to scan vehicle QR codes. Please enable it in your browser or device settings.'}
        {state === 'UNSUPPORTED' && 'No suitable camera was found on your device. Please ensure your camera is connected and not in use by another app.'}
        {state === 'REQUESTING' && 'Please allow camera access when prompted by your browser.'}
      </p>

      {(state === 'DENIED' || state === 'UNSUPPORTED') && (
        <button
          onClick={onRetry}
          className="w-full max-w-[280px] py-4 bg-primary-green rounded-xl text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_4px_14px_0_rgba(30,142,90,0.39)]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
