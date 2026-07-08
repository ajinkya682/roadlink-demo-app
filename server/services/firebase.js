const admin = require('firebase-admin');
const { getApps } = require('firebase-admin/app');
const { logger } = require('../middleware/logger');

function initFirebase() {
  try {
    if (getApps().length === 0) {
      // For production, you should provide the service account key.
      // Usually via a base64 encoded environment variable or file path.
      if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        const serviceAccount = JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii')
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        logger.info('Firebase Admin SDK initialized successfully.');
      } else {
        logger.warn('Firebase Admin SDK not initialized: Missing FIREBASE_SERVICE_ACCOUNT_BASE64 env var.');
      }
    }
  } catch (error) {
    logger.error('Error initializing Firebase Admin SDK:', error);
  }
}

module.exports = { admin, initFirebase };
