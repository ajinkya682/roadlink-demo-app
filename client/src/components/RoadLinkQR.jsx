import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import roadlinkLogo from "../assets/roadlink-logo-qr.png";

// Base configuration for a premium, 100% scannable QR code
export const getQRConfig = (url, size = 280, isCanvas = false) => {
  // ISO standard requires a 4-module quiet zone. 
  // At Level H, a typical URL is ~Version 3 (29x29 modules). 
  // 4 modules / 29 modules ≈ 13.8% of the dimension.
  // We'll use a dynamic margin to guarantee scan reliability.
  const quietZonePx = Math.floor(size * 0.12);

  return {
    width: size,
    height: size,
    type: isCanvas ? "canvas" : "svg", // SVG for screen, Canvas for download
    data: url,
    image: roadlinkLogo,
    margin: quietZonePx,
    qrOptions: {
      errorCorrectionLevel: "H" // Mandatory for logo overlay
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.18, // Max 18% to ensure 100% scan reliability
      margin: 6, // White padding around logo
      crossOrigin: "anonymous"
    },
    dotsOptions: {
      color: "#0B1533", // Deep Navy
      type: "rounded"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    cornersSquareOptions: {
      color: "#6C4CF5", // RoadLink Purple
      type: "extra-rounded"
    },
    cornersDotOptions: {
      color: "#0B1533", // Deep Navy for inner dot
      type: "dot"
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
