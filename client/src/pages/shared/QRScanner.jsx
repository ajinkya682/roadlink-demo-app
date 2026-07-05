import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NativeFeedback } from '../../hooks/useNative';
import { hapticManager } from '../../services/sound/HapticManager';
import { useAppData } from '../../context/AppContext';
import api from '../../lib/api';
import { detectQRType, extractVehicleID, QR_TYPES } from '../../lib/qr';
import { useCameraPermission, PERMISSION_STATES } from '../../hooks/useCameraPermission';
import { useQRCodeScanner } from '../../hooks/useQRCodeScanner';

// Components
import ScannerCamera from '../../components/scanner/ScannerCamera';
import ScannerOverlay from '../../components/scanner/ScannerOverlay';
import ScannerControls from '../../components/scanner/ScannerControls';
import ScannerResult from '../../components/scanner/ScannerResult';
import PermissionState from '../../components/scanner/PermissionState';

export default function QRScanner() {
  const navigate = useNavigate();
  const { vehicles } = useAppData();
  
  // States
  const [errorFlash, setErrorFlash] = useState(false);
  const [scannedResult, setScannedResult] = useState(null); // Full result object from detectQRType

  // Hooks
  const { 
    permissionState, 
    isGranted, 
    cameras, 
    activeCameraId, 
    setActiveCameraId,
    requestPermission 
  } = useCameraPermission();

  // Initial permission request
  useEffect(() => {
    if (permissionState === PERMISSION_STATES.IDLE) {
      requestPermission();
    }
  }, [permissionState, requestPermission]);

  const handleScanSuccess = async (decodedText) => {
    if (scannedResult) return; // Prevent duplicate reads
    
    hapticManager.success();
    
    const qrData = detectQRType(decodedText);
    
    if (qrData.isRoadLink) {
      // Handle RoadLink QR routing directly without showing result card
      try {
        const token = extractVehicleID(qrData.value);
        if (!token) throw new Error('Invalid RoadLink QR Format');

        // Always navigate to scan landing with the qr parameter
        if (token === 'ROADLINK-SIMULATED123') {
          return navigate(`/scan-landing?qr=${token}`, { state: { qrId: token, profile: { publicDisplayName: 'TEST VEHICLE' } } });
        }

        const res = await api.get(`/vehicles/resolve?token=${token}`);
        if (res.data.success) {
          navigate(`/scan-landing?qr=${token}`, { state: { qrId: token, profile: res.data.data.profile } });
        } else {
          throw new Error('Invalid QR');
        }
      } catch (err) {
        console.error(err);
        handleErrorFlash();
      }
    } else {
      // Show result card for non-RoadLink QRs
      setScannedResult(qrData);
    }
  };

  const handleErrorFlash = async () => {
    setErrorFlash(true);
    hapticManager.error();
    setTimeout(() => {
      setErrorFlash(false);
      resumeScanning(); // Allow another scan
    }, 1500);
  };

  const { isScanning, resumeScanning } = useQRCodeScanner({
    cameraId: activeCameraId,
    onScanSuccess: handleScanSuccess,
    onScanError: () => { /* Handle silent errors like nothing found yet */ },
    pauseOnScan: true,
    isReady: isGranted,
  });

  const handleDismissResult = () => {
    setScannedResult(null);
    resumeScanning();
  };

  // Render Error/Permission states
  if (permissionState === PERMISSION_STATES.DENIED || permissionState === PERMISSION_STATES.UNSUPPORTED) {
    return <PermissionState state={permissionState} onRetry={requestPermission} />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-black">
      {/* ── CAMERA LAYER ── */}
      {isGranted && <ScannerCamera />}

      {/* ── OVERLAY LAYER ── */}
      <ScannerOverlay 
        scanned={!!scannedResult || errorFlash} 
        errorFlash={errorFlash} 
      />

      {/* ── CONTROLS LAYER ── */}
      <ScannerControls 
        cameras={cameras} 
        activeCameraId={activeCameraId} 
        onSwitchCamera={setActiveCameraId} 
      />

      {/* ── RESULT LAYER ── */}
      <ScannerResult 
        result={scannedResult} 
        onDismiss={handleDismissResult} 
      />
    </div>
  );
}

