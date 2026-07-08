import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export function useQRCodeScanner({
  cameraId,
  onScanSuccess,
  onScanError,
  pauseOnScan = true,
  fps = 20,
  qrbox = undefined,
  isReady = true,
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  const scannerRef = useRef(null);
  const isComponentMounted = useRef(true);

  // We need to keep a ref to the latest success callback so the internal scanner callback
  // doesn't use a stale closure or get re-registered unnecessarily.
  const latestOnScanSuccess = useRef(onScanSuccess);

  useEffect(() => {
    latestOnScanSuccess.current = onScanSuccess;
  }, [onScanSuccess]);

  // Initialize scanner when component mounts and isReady is true
  useEffect(() => {
    isComponentMounted.current = true;
    
    if (!isReady) return; // Wait for DOM element to be rendered

    // Create instance but don't start yet
    try {
      const instance = new Html5Qrcode('qr-reader-element', {
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      });
      setScannerInstance(instance);
      scannerRef.current = instance;
    } catch (e) {
      console.error("Html5Qrcode init error:", e);
    }

    return () => {
      isComponentMounted.current = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
             scannerRef.current.clear();
          }).catch(err => {
             console.error("Error stopping scanner on unmount", err);
          });
        } else {
           scannerRef.current.clear();
        }
      }
    };
  }, [isReady]);

  const isStartingRef = useRef(false);

  const startScanning = useCallback(async (customCameraId = null) => {
    const idToUse = customCameraId || cameraId;
    if (!scannerInstance || !idToUse || isStartingRef.current) return;

    if (scannerInstance.isScanning || scannerInstance.getState() === 2) { // 2 = SCANNING
      return;
    }

    isStartingRef.current = true;
    try {
      const config = { fps, disableFlip: false };
      if (qrbox) {
        config.qrbox = { width: qrbox, height: qrbox };
      }
      
      await scannerInstance.start(
        idToUse,
        config,
        (decodedText, decodedResult) => {
          if (pauseOnScan && scannerInstance.isScanning) {
             scannerInstance.pause();
          }
          if (latestOnScanSuccess.current) {
            latestOnScanSuccess.current(decodedText, decodedResult);
          }
        },
        (errorMessage) => {
           if (onScanError) onScanError(errorMessage);
        }
      );
      
      if (isComponentMounted.current) {
         setIsScanning(true);
      }
    } catch (err) {
      // Ignore routine errors like NotFoundError which html5-qrcode frequently throws internally
      if (err?.name !== 'NotFoundError' && !String(err).includes('NotFound')) {
        console.warn("Scanner start warning:", err);
      }
      setIsScanning(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [scannerInstance, cameraId, fps, qrbox, pauseOnScan, onScanError]);

  const stopScanning = useCallback(async () => {
    if (scannerInstance && (scannerInstance.isScanning || scannerInstance.getState() === 2)) {
      try {
        await scannerInstance.stop();
        if (isComponentMounted.current) {
           setIsScanning(false);
        }
      } catch (err) {
        // Silently catch - often throws if already stopped or transitioning
      }
    }
  }, [scannerInstance]);

  const pauseScanning = useCallback(() => {
    if (scannerInstance && scannerInstance.isScanning) {
      try { scannerInstance.pause(); } catch(e) {}
    }
  }, [scannerInstance]);

  const resumeScanning = useCallback(() => {
    if (scannerInstance && scannerInstance.getState() === 3) { // 3 = PAUSED
      try { scannerInstance.resume(); } catch(e) {}
    }
  }, [scannerInstance]);

  // Auto-start when cameraId becomes available
  useEffect(() => {
    if (cameraId && scannerInstance && !scannerInstance.isScanning && !isStartingRef.current) {
       startScanning(cameraId);
    }
  }, [cameraId, scannerInstance, startScanning]);


  return {
    isScanning,
    startScanning,
    stopScanning,
    pauseScanning,
    resumeScanning
  };
}
