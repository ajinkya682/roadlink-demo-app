const NotificationLog = require('../../models/NotificationLog');
const { logger } = require('../../middleware/logger');

// Stub for push notifications (FCM)
class NotificationService {
  async dispatchReportNotification(report, vehicleOwnerId) {
    try {
      // 1. Channel selection (Stubbed channel priority: push -> whatsapp -> sms -> email)
      // For MVP, we only trigger "push"
      const channel = 'push';
      
      logger.info(`[FCM Push] Sending push notification to owner ${vehicleOwnerId} for report ${report._id}`);
      
      // Stub: in reality, look up FCM token for vehicleOwnerId and use firebase-admin
      
      const providerResponse = {
        messageId: `sim-${Date.now()}`,
        status: 'accepted'
      };

      // 2. Log delivery attempt
      await NotificationLog.create({
        reportId: report._id,
        channel,
        status: 'sent', // sent to provider
        providerResponse
      });

      return true;
    } catch (error) {
      logger.error('Error dispatching notification:', error);
      
      await NotificationLog.create({
        reportId: report._id,
        channel: 'push',
        status: 'failed',
        providerResponse: { error: error.message }
      });
      
      return false;
    }
  }
}

module.exports = new NotificationService();
