import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import roadlinkLogo from "../assets/roadlink-logo-qr.png";

export const getQRConfig = (url, size = 280, isCanvas = false) => {
  // A dynamic margin ensures a proper quiet zone on both screen (280px) and print (1024px).
  // 10% margin on each side leaves 80% of the canvas for the QR code.
  const quietZonePx = Math.floor(size * 0.10);

  return {
    width: size,
    height: size,
    type: isCanvas ? "canvas" : "svg", 
    data: url,
    image: roadlinkLogo,
    margin: quietZonePx,
    qrOptions: {
      errorCorrectionLevel: "H" // Level H provides 30% error correction
    },
    imageOptions: {
      hideBackgroundDots: true,
      // Logo takes up 16% of total canvas (which is ~19% of the functional QR area)
      // This is extremely safe and well below the 30% threshold.
      imageSize: 0.16, 
      margin: 2, // Minimal white padding to prevent module clipping
      crossOrigin: "anonymous"
    },
    dotsOptions: {
      color: "#0B1533", // Deep Navy
      type: "square" // Standard square modules guarantee 100% scan reliability on all cameras
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    cornersSquareOptions: {
      color: "#0B1533", // Deep Navy (Kept dark for 100% scan reliability)
      type: "square" // MUST be square for the scanner's geometric detection
    },
    cornersDotOptions: {
      color: "#6C4CF5", // RoadLink Purple inner dot for the two-tone theme!
      type: "dot" // Rounded inner dot matches premium aesthetics
    }
  };
};

export const downloadRoadLinkQR = async (url, filename, extension = "png", size = 1024) => {
  // Always use Canvas for downloading PNGs to ensure crisp exports
  const qrCode = new QRCodeStyling(getQRConfig(url, size, true));
  await qrCode.download({ name: filename, extension });
};

export default function RoadLinkQR({ url, size = 160 }) {
  const ref = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    // Generate SVG for on-screen crispness and scaling
    const config = getQRConfig(url, size, false);
    
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(config);
    } else {
      qrCode.current.update(config);
    }
    
    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.current.append(ref.current);
    }
  }, [url, size]);

  return (
    <div 
      ref={ref} 
      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full bg-white rounded-2xl" 
    />
  );
}
