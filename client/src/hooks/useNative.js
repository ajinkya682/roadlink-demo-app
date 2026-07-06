// A web-only version of the native hooks

export const SecureStorage = {
  async set(key, value) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  async get(key) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  async remove(key) {
    localStorage.removeItem(key);
  },
  async clear() {
    localStorage.clear();
  }
};

export const NativeFeedback = {
  async toast(text, duration = 'short', position = 'bottom') {
    // Simple web fallback for toast
    alert(text);
  },
  async vibrateSuccess() {
    if (navigator.vibrate) navigator.vibrate(50);
  },
  async vibrateError() {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }
};

export const NativeInfo = {
  async getInfo() {
    return {
      platform: 'web',
      os: 'web',
      model: navigator.userAgent
    };
  },
  async monitorNetwork(callback) {
    const checkStatus = () => callback({ connected: navigator.onLine });
    checkStatus();
    
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);
    
    return {
      remove: () => {
        window.removeEventListener('online', checkStatus);
        window.removeEventListener('offline', checkStatus);
      }
    };
  }
};
