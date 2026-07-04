export const QR_TYPES = {
  ROADLINK: 'ROADLINK',
  HTTPS: 'HTTPS',
  HTTP: 'HTTP',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  SMS: 'SMS',
  GEO: 'GEO',
  WIFI: 'WIFI',
  JSON: 'JSON',
  TEXT: 'TEXT',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Validates if a string is a safe HTTP/HTTPS URL
 */
export const validateURL = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Checks if a URL is a RoadLink QR
 */
export const isRoadLinkQR = (text) => {
  if (text.startsWith('roadlink://v/') || text.startsWith('roadlink://vehicle/')) return true;
  if (text.startsWith('https://roadlink.app/v/') || text.startsWith('http://roadlink.app/v/')) return true;
  if (text.startsWith('https://roadlink.app/verify/') || text.startsWith('http://roadlink.app/verify/')) return true;
  return false;
};

/**
 * Extracts the vehicle ID or token from a RoadLink QR
 */
export const extractVehicleID = (text) => {
  if (!isRoadLinkQR(text)) return null;
  
  if (text.startsWith('roadlink://v/')) return text.replace('roadlink://v/', '');
  if (text.startsWith('roadlink://vehicle/')) return text.replace('roadlink://vehicle/', '');
  
  try {
    const url = new URL(text);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // pathParts will be like ['v', 'token'] or ['verify', 'token']
    if (pathParts.length >= 2 && (pathParts[0] === 'v' || pathParts[0] === 'verify')) {
      return pathParts[1];
    }
  } catch (e) {
    // ignore parsing errors
  }
  
  return null;
};

/**
 * Extracts domain from URL
 */
export const extractDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/**
 * Classifies a QR code based on its content
 */
export const detectQRType = (text) => {
  if (!text) return { type: QR_TYPES.UNKNOWN, label: 'Unknown', icon: 'HelpCircle', value: '', isRoadLink: false, isSafeURL: false };

  text = text.trim();

  // 1. RoadLink
  if (isRoadLinkQR(text)) {
    return {
      type: QR_TYPES.ROADLINK,
      label: 'RoadLink Vehicle',
      icon: 'ShieldCheck', // Lucide icon name
      value: text,
      isRoadLink: true,
      isSafeURL: true
    };
  }

  // 2. Protocols
  if (text.toLowerCase().startsWith('mailto:')) {
    return { type: QR_TYPES.EMAIL, label: 'Email Address', icon: 'Mail', value: text.replace(/^mailto:/i, ''), isRoadLink: false, isSafeURL: false };
  }
  
  if (text.toLowerCase().startsWith('tel:')) {
    return { type: QR_TYPES.PHONE, label: 'Phone Number', icon: 'Phone', value: text.replace(/^tel:/i, ''), isRoadLink: false, isSafeURL: false };
  }
  
  if (text.toLowerCase().startsWith('sms:')) {
    return { type: QR_TYPES.SMS, label: 'SMS Message', icon: 'MessageSquare', value: text.replace(/^sms:/i, ''), isRoadLink: false, isSafeURL: false };
  }

  if (text.toLowerCase().startsWith('geo:')) {
    return { type: QR_TYPES.GEO, label: 'Location Coordinates', icon: 'MapPin', value: text.replace(/^geo:/i, ''), isRoadLink: false, isSafeURL: false };
  }

  if (text.toUpperCase().startsWith('WIFI:')) {
    return { type: QR_TYPES.WIFI, label: 'WiFi Network', icon: 'Wifi', value: text, isRoadLink: false, isSafeURL: false };
  }

  // 3. Web URLs
  if (validateURL(text)) {
    const isHttps = text.toLowerCase().startsWith('https://');
    return {
      type: isHttps ? QR_TYPES.HTTPS : QR_TYPES.HTTP,
      label: isHttps ? 'Secure Website' : 'Globe', // Using Globe instead of Link for better visual
      icon: 'Globe',
      value: text,
      isRoadLink: false,
      isSafeURL: true
    };
  }
  
  // Reject unsafe schemes explicitly if they look like urls but failed validateURL
  if (/^[a-z]+:/i.test(text) && !text.toUpperCase().startsWith('WIFI:')) {
     return { type: QR_TYPES.TEXT, label: 'Text Data', icon: 'FileText', value: text, isRoadLink: false, isSafeURL: false };
  }

  // 4. JSON
  if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    try {
      JSON.parse(text);
      return { type: QR_TYPES.JSON, label: 'JSON Data', icon: 'Code', value: text, isRoadLink: false, isSafeURL: false };
    } catch {
      // Not valid JSON, fallback to text
    }
  }

  // 5. Fallback Text
  return { type: QR_TYPES.TEXT, label: 'Plain Text', icon: 'AlignLeft', value: text, isRoadLink: false, isSafeURL: false };
};
