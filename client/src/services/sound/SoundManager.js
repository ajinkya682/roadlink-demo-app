import { db } from '../../lib/db/database';
import notificationSound from '../../assets/sounds/notification.wav';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.initialized = false;
    this.lastPlayed = {
      notification: 0
    };
    this.throttleMs = 300; // Prevent machine-gun sounds
  }

  init() {
    if (this.initialized) return;
    
    // Preload audio objects
    this.sounds.notification = new Audio(notificationSound);
    
    // Preload into memory without playing
    Object.values(this.sounds).forEach(audio => {
      audio.load();
    });
    
    this.initialized = true;
  }

  async isSoundEnabled() {
    try {
      const user = await db.user.get('me');
      if (user && user.notificationPrefs && typeof user.notificationPrefs.sound === 'boolean') {
        return user.notificationPrefs.sound;
      }
      return true; // Default to true if not set
    } catch (e) {
      return true; // Failsafe
    }
  }

  async play(type) {
    if (!this.initialized) this.init();

    // Check throttle
    const now = Date.now();
    if (now - this.lastPlayed[type] < this.throttleMs) {
      return; // Skip overlapping sounds
    }

    const enabled = await this.isSoundEnabled();
    if (!enabled) return;

    const audio = this.sounds[type];
    if (audio) {
      this.lastPlayed[type] = now;
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(e => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SoundManager] Audio playback failed:', e);
        }
      });
    }
  }
}

export const soundManager = new SoundManager();
