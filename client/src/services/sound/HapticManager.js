import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
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
    if (!Capacitor.isNativePlatform()) return;
    if (!(await this.isHapticEnabled())) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async error() {
    if (!Capacitor.isNativePlatform()) return;
    if (!(await this.isHapticEnabled())) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
    setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 100);
  }

  async notification() {
    if (!Capacitor.isNativePlatform()) return;
    if (!(await this.isHapticEnabled())) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }
}

export const hapticManager = new HapticManager();
