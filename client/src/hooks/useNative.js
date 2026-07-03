import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';

export const NativeCamera = {
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      return image;
    } catch (error) {
      console.error('Camera error', error);
      return null;
    }
  },
  async pickFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });
      return image;
    } catch (error) {
      console.error('Gallery error', error);
      return null;
    }
  }
};

export const NativeLocation = {
  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
    } catch (error) {
      console.error('Location error', error);
      return null;
    }
  }
};

export const SecureStorage = {
  async set(key, value) {
    await Preferences.set({
      key: key,
      value: typeof value === 'string' ? value : JSON.stringify(value)
    });
  },
  async get(key) {
    const { value } = await Preferences.get({ key });
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  async remove(key) {
    await Preferences.remove({ key });
  },
  async clear() {
    await Preferences.clear();
  }
};

export const NativeFeedback = {
  async toast(text, duration = 'short', position = 'bottom') {
    await Toast.show({
      text,
      duration,
      position
    });
  },
  async vibrateSuccess() {
    await Haptics.impact({ style: ImpactStyle.Light });
  },
  async vibrateError() {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 100);
  }
};

export const NativeInfo = {
  async getInfo() {
    const info = await Device.getInfo();
    return info;
  },
  async monitorNetwork(callback) {
    const status = await Network.getStatus();
    callback(status);
    return Network.addListener('networkStatusChange', (status) => {
      callback(status);
    });
  }
};
