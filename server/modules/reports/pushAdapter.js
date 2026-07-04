const { logger } = require('../../middleware/logger');

class PushAdapter {
  async send(owner, report) {
    if (!owner.fcmToken) {
      return { status: 'unavailable', providerResponse: { message: 'No FCM token on file' } };
    }

    try {
      logger.info(`[FCM Push] Sending push to owner ${owner._id} for report ${report._id}`);
      
      const payload = {
        title: this.getCategoryLabel(report.category),
        body: `Reported on your vehicle. Open the app to see details.`,
        data: {
          reportId: report._id.toString(),
          vehicleId: (report.vehicleId._id || report.vehicleId).toString()
        }
      };

      // Stub: in reality, use firebase-admin: await admin.messaging().send({ token: owner.fcmToken, ...payload })
      
      // Simulate failure if token is explicitly set to 'fail-token' for testing
      if (owner.fcmToken === 'fail-token') {
        throw new Error('FCM Service Unavailable (Simulated)');
      }

      const providerResponse = {
        messageId: `fcm-${Date.now()}`,
        status: 'accepted',
        payload
      };

      return { status: 'delivered', providerResponse };
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
