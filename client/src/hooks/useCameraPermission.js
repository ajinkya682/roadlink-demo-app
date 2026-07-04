import { useState, useEffect, useCallback } from 'react';

export const PERMISSION_STATES = {
  IDLE: 'IDLE',
  REQUESTING: 'REQUESTING',
  GRANTED: 'GRANTED',
  DENIED: 'DENIED',
  UNSUPPORTED: 'UNSUPPORTED'
};

export function useCameraPermission() {
  const [permissionState, setPermissionState] = useState(PERMISSION_STATES.IDLE);
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);

  const checkSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionState(PERMISSION_STATES.UNSUPPORTED);
      return false;
    }
    return true;
  };

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoDevices);
      
      if (videoDevices.length > 0) {
        // Try to find a back camera
        const backCamera = videoDevices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('environment') ||
          d.label.toLowerCase().includes('rear')
        );
        
        setActiveCameraId(backCamera ? backCamera.deviceId : videoDevices[0].deviceId);
      }
      return videoDevices;
    } catch (err) {
      console.error("Error enumerating devices:", err);
      return [];
    }
  };

  const requestPermission = useCallback(async () => {
    if (!checkSupport()) return false;

    setPermissionState(PERMISSION_STATES.REQUESTING);

    try {
      // We request video access. We only need the stream momentarily to trigger the prompt, 
      // then we immediately release it so html5-qrcode can take over cleanly.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Release it right away
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionState(PERMISSION_STATES.GRANTED);
      await getCameras();
      return true;
    } catch (err) {
      console.error("Camera permission denied:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
         setPermissionState(PERMISSION_STATES.DENIED);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
         setPermissionState(PERMISSION_STATES.UNSUPPORTED);
      } else {
         setPermissionState(PERMISSION_STATES.DENIED);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    // Optionally check if we already have permission without prompting
    // but standard getUserMedia doesn't allow "checking" without prompting easily
    // unless using the Permissions API, which isn't perfectly supported for camera.
    // We will just let the consumer call requestPermission()
  }, []);

  return {
    permissionState,
    isGranted: permissionState === PERMISSION_STATES.GRANTED,
    isDenied: permissionState === PERMISSION_STATES.DENIED,
    isUnsupported: permissionState === PERMISSION_STATES.UNSUPPORTED,
    isRequesting: permissionState === PERMISSION_STATES.REQUESTING,
    cameras,
    activeCameraId,
    setActiveCameraId,
    requestPermission
  };
}
