import React from 'react';

export default function ScannerCamera() {
  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden flex items-center justify-center">
      {/* 
        This is the container html5-qrcode will bind to.
        We style the video element via CSS to ensure it covers the screen nicely.
      */}
      <div 
        id="qr-reader-element" 
        className="w-full h-full flex items-center justify-center [&>*:not(video)]:opacity-0 [&>*:not(video)]:pointer-events-none"
      />
    </div>
  );
}
