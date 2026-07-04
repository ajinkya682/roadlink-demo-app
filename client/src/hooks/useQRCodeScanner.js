import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useQRCodeScanner({
  cameraId,
  onScanSuccess,
  onScanError,
  pauseOnScan = true,
  fps = 10,
  qrbox = 250,
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
      const instance = new Html5Qrcode('qr-reader-element', false);
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

  const startScanning = useCallback(async (customCameraId = null) => {
    const idToUse = customCameraId || cameraId;
    if (!scannerInstance || !idToUse) return;

    if (scannerInstance.isScanning) {
      await scannerInstance.stop();
    }

    try {
      await scannerInstance.start(
        idToUse,
        {
          fps,
          qrbox: { width: qrbox, height: qrbox },
          disableFlip: false, // Allow mirror for front, etc.
        },
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
      console.error("Failed to start scanner:", err);
      setIsScanning(false);
    }
  }, [scannerInstance, cameraId, fps, qrbox, pauseOnScan, onScanError]);

  const stopScanning = useCallback(async () => {
    if (scannerInstance && scannerInstance.isScanning) {
      try {
        await scannerInstance.stop();
        if (isComponentMounted.current) {
           setIsScanning(false);
        }
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  }, [scannerInstance]);

  const pauseScanning = useCallback(() => {
    if (scannerInstance && scannerInstance.isScanning) {
      scannerInstance.pause();
    }
  }, [scannerInstance]);

  const resumeScanning = useCallback(() => {
    if (scannerInstance && scannerInstance.isScanning) {
      scannerInstance.resume();
    }
  }, [scannerInstance]);

  // Auto-start when cameraId becomes available
  useEffect(() => {
    if (cameraId && scannerInstance && !scannerInstance.isScanning) {
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
