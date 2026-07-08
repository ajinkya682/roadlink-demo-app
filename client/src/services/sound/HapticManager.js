import { db } from '../../lib/db/database';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Capacitor } from '@capacitor/core';
import notificationSound from '../../assets/sounds/notification.wav';
import successSound from '../../assets/sounds/success.mp3';
import errorSound from '../../assets/sounds/error.mp3';

class HapticManager {
  constructor() {
    this.initialized = false;
    this.initAudio();
  }

  async initAudio() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await NativeAudio.preload({ assetId: 'notification', assetPath: 'public/assets/sounds/notification.wav', isComplex: false, volume: 1.0 });
      await NativeAudio.preload({ assetId: 'success', assetPath: 'public/assets/sounds/success.mp3', isComplex: false, volume: 1.0 });
      await NativeAudio.preload({ assetId: 'error', assetPath: 'public/assets/sounds/error.mp3', isComplex: false, volume: 1.0 });
      this.initialized = true;
    } catch (e) {
      console.warn('NativeAudio preload error:', e);
    }
  }

  async isHapticEnabled() {
    try {
      const user = await db.user.get('me');
      if (user && user.notificationPrefs && typeof user.notificationPrefs.haptic === 'boolean') {
        return user.notificationPrefs.haptic;
      }
      return true; // Default to true
    } catch (e) {
      return true;
    }
  }

  async isSoundEnabled() {
    try {
      const user = await db.user.get('me');
      if (user && user.notificationPrefs && typeof user.notificationPrefs.sound === 'boolean') {
        return user.notificationPrefs.sound;
      }
      return true; // Default to true
    } catch (e) {
      return true;
    }
  }

  async playAudio(assetId, webAudioSrc) {
    if (!(await this.isSoundEnabled())) return;
    
    if (Capacitor.isNativePlatform() && this.initialized) {
      try {
        await NativeAudio.play({ assetId });
      } catch (e) {
        console.warn('NativeAudio play error:', e);
      }
    } else {
      try {
        const audio = new Audio(webAudioSrc);
        audio.volume = 0.5;
        await audio.play();
      } catch (e) {
        console.log('Audio playback prevented by browser:', e);
      }
    }
  }

  async vibrateSuccess() {
    if (await this.isHapticEnabled() && navigator.vibrate) {
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      try { navigator.vibrate(50); } catch(e) {}
    }
  }

  async vibrateError() {
    if (await this.isHapticEnabled() && navigator.vibrate) {
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      try { navigator.vibrate([100, 50, 100]); } catch(e) {}
    }
  }

  async vibrateNotification() {
    if (await this.isHapticEnabled() && navigator.vibrate) {
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      try { navigator.vibrate([50, 100, 50]); } catch(e) {}
    }
  }

  async playSuccessSound() {
    this.playAudio('success', successSound);
  }

  async playErrorSound() {
    this.playAudio('error', errorSound);
  }

  async playNotificationSound() {
    this.playAudio('notification', notificationSound);
  }
}

export const hapticManager = new HapticManager();
