import { db } from '../../lib/db/database';
import notificationSound from '../../assets/sounds/notification.wav';
import successSound from '../../assets/sounds/success.mp3';
import errorSound from '../../assets/sounds/error.mp3';

class HapticManager {
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

  async playAudio(audioSrc) {
    if (!(await this.isSoundEnabled())) return;
    try {
      const audio = new Audio(audioSrc);
      audio.volume = 0.5; // reasonable default volume
      await audio.play();
    } catch (e) {
      console.log('Audio playback prevented by browser:', e);
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
    this.playAudio(successSound);
  }

  async playErrorSound() {
    this.playAudio(errorSound);
  }

  async playNotificationSound() {
    this.playAudio(notificationSound);
  }
}

export const hapticManager = new HapticManager();
