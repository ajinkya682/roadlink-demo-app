import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const backPressedOnce = useRef(false);
  const backTimer = useRef(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = App.addListener('backButton', ({ canGoBack }) => {
      const isOnDashboard = location.pathname === '/dashboard';

      if (!isOnDashboard) {
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // On Dashboard — double-back-to-exit
      if (backPressedOnce.current) {
        clearTimeout(backTimer.current);
        App.exitApp();
        return;
      }

      backPressedOnce.current = true;
      Toast.show({ text: 'Press back again to exit', duration: 'short', position: 'bottom' });
      backTimer.current = setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);
    });

    return () => {
      handler.then(h => h.remove());
      clearTimeout(backTimer.current);
    };
  }, [navigate, location.pathname]);
}
