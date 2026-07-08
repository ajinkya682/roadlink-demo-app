const { logger } = require('../../middleware/logger');

const { getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const User = require('../../models/User');

class PushAdapter {
  async send(owner, report) {
    if (!owner.deviceTokens || owner.deviceTokens.length === 0) {
      return { status: 'unavailable', providerResponse: { message: 'No FCM tokens on file' } };
    }

    if (getApps().length === 0) {
      logger.warn('[FCM Push] Firebase Admin not initialized. Skipping push.');
      return { status: 'unavailable', providerResponse: { message: 'Firebase Admin not initialized' } };
    }

    try {
      logger.info(`[FCM Push] Sending push to owner ${owner._id} across ${owner.deviceTokens.length} devices for report ${report._id}`);
      
      const payload = {
        notification: {
          title: this.getCategoryLabel(report.category),
          body: `Reported on your vehicle. Open the app to see details.`
        },
        data: {
          reportId: report._id.toString(),
          vehicleId: (report.vehicleId._id || report.vehicleId).toString(),
          url: `/notification-detail/${report._id.toString()}` // Deep link for Service Worker
        }
      };

      const tokens = owner.deviceTokens.map(dt => dt.token);

      const response = await getMessaging().sendEachForMulticast({
        tokens,
        notification: payload.notification,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: report.category === 'emergency' || report.category === 'theft' ? 'emergency_alerts' : 'general_alerts'
          }
        },
        data: payload.data
      });

      // Handle invalid/revoked tokens
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errCode = resp.error?.code;
            if (
              errCode === 'messaging/invalid-registration-token' ||
              errCode === 'messaging/registration-token-not-registered'
            ) {
              failedTokens.push(tokens[idx]);
            }
          }
        });

        if (failedTokens.length > 0) {
          logger.info(`[FCM Push] Removing ${failedTokens.length} invalid tokens for user ${owner._id}`);
          await User.updateOne(
            { _id: owner._id },
            { $pull: { deviceTokens: { token: { $in: failedTokens } } } }
          );
        }
      }

      const providerResponse = {
        messageId: `fcm-multicast-${Date.now()}`,
        status: response.successCount > 0 ? 'accepted' : 'failed',
        successCount: response.successCount,
        failureCount: response.failureCount,
        payload
      };

      return { status: response.successCount > 0 ? 'delivered' : 'failed', providerResponse };
    } catch (error) {
      logger.error(`[FCM Push Error] ${error.message}`);
      return { status: 'failed', providerResponse: { error: error.message } };
    }
  }

  getCategoryLabel(category) {
    const labels = {
      'wrong_parking': 'Wrong Parking',
      'theft': 'Vehicle Theft',
      'emergency': 'Emergency',
      'block_road': 'Blocked Road',
      'headlights_on': 'Headlights On'
    };
    return labels[category] || 'Vehicle Alert';
  }
}

module.exports = new PushAdapter();
