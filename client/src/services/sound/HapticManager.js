import { db } from '../../lib/db/database';

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

  async success() {
    if (!(await this.isHapticEnabled())) return;
    if (navigator.vibrate) navigator.vibrate(50);
  }

  async error() {
    if (!(await this.isHapticEnabled())) return;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }

  async notification() {
    if (!(await this.isHapticEnabled())) return;
    if (navigator.vibrate) navigator.vibrate(50);
  }
}

export const hapticManager = new HapticManager();
