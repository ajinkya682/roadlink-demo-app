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
        className="w-full h-full relative flex items-center justify-center [&_canvas]:!hidden [&>div]:!w-full [&>div]:!h-full [&>div]:!static [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full [&_video]:!absolute [&_video]:!top-0 [&_video]:!left-0"
      />
    </div>
  );
}
