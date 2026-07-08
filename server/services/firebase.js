const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { logger } = require('../middleware/logger');

function initFirebase() {
  try {
    if (getApps().length === 0) {
      // For production, you should provide the service account key.
      // Usually via a base64 encoded environment variable or file path.
      if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        // Strip out any accidental spaces or newlines from copy-pasting
        const cleanBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.replace(/\s+/g, '');
        const decoded = Buffer.from(cleanBase64, 'base64').toString('utf8');
        
        try {
          const serviceAccount = JSON.parse(decoded);
          initializeApp({
            credential: cert(serviceAccount)
          });
          logger.info('Firebase Admin SDK initialized successfully.');
        } catch (parseError) {
          logger.error('CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64 JSON. The base64 string might be invalid or truncated.', parseError);
        }
      } else {
        logger.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var.');
      }
    }
  } catch (error) {
    logger.error('Error initializing Firebase Admin SDK:', error);
  }
}

module.exports = { initFirebase };
