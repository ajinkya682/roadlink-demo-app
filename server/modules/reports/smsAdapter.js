const { logger } = require('../../middleware/logger');

class SmsAdapter {
  async send(owner, report) {
    if (!owner.phone) {
      return { status: 'unavailable', providerResponse: { message: 'No phone number on file' } };
    }

    if (process.env.SMS_ENABLED === 'false') {
      logger.info(`[MSG91 Disabled] SMS notification bypassed for ${owner._id}`);
      return { status: 'delivered', providerResponse: { messageId: 'msg91-bypassed', status: 'accepted' } };
    }

    try {
      logger.info(`[MSG91 SMS] Sending SMS to owner ${owner._id} for report ${report._id}`);
      
      const categoryLabel = this.getCategoryLabel(report.category);
      // In a real app, we'd pass the vehicle name down, or just use a generic term
      const message = `RoadLink: ${categoryLabel} reported on your vehicle. Open the app to see details.`;

      // Stub: in reality, HTTP request to MSG91 API
      
      if (owner.phone === 'fail-phone') {
        throw new Error('MSG91 Service Unavailable (Simulated)');
      }

      const providerResponse = {
        messageId: `msg91-${Date.now()}`,
        status: 'accepted',
        payload: { to: owner.phone, message }
      };

      return { status: 'delivered', providerResponse };
    } catch (error) {
      logger.error(`[MSG91 SMS Error] ${error.message}`);
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

module.exports = new SmsAdapter();
