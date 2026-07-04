const NotificationLog = require('../../models/NotificationLog');
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');
const { logger } = require('../../middleware/logger');
const pushAdapter = require('./pushAdapter');
const smsAdapter = require('./smsAdapter');

class NotificationOrchestrator {
  async orchestrate(report) {
    try {
      const vehicleId = report.vehicleId._id || report.vehicleId;
      const vehicle = await Vehicle.findById(vehicleId).select('ownerId');
      if (!vehicle) {
        logger.error(`[Orchestrator] Vehicle not found for report ${report._id}`);
        return;
      }

      const owner = await User.findById(vehicle.ownerId);
      if (!owner) {
        logger.error(`[Orchestrator] Owner not found for vehicle ${vehicleId}`);
        return;
      }

      const isUrgent = ['emergency', 'theft'].includes(report.category);

      if (isUrgent) {
        logger.info(`[Orchestrator] Urgent report ${report._id}. Firing all channels.`);
        // Fire all available channels at once, ignore prefs
        const [pushResult, smsResult] = await Promise.all([
          pushAdapter.send(owner, report),
          smsAdapter.send(owner, report)
        ]);

        await this.log(report._id, 'push', pushResult);
        await this.log(report._id, 'sms', smsResult);
        return;
      }

      const prefs = owner.notificationPrefs || {};

      // Try Push
      if (prefs.push !== false && owner.fcmToken) {
        let result = await pushAdapter.send(owner, report);
        
        // If push failed (but was available), retry once
        if (result.status === 'failed') {
          logger.warn(`[Orchestrator] Push failed for ${report._id}, retrying once...`);
          result = await pushAdapter.send(owner, report);
        }

        await this.log(report._id, 'push', result);

        if (result.status === 'delivered') {
          return; // Stop at first success
        }
      }

      // Fallback to SMS
      if (prefs.sms !== false) {
        const result = await smsAdapter.send(owner, report);
        await this.log(report._id, 'sms', result);
        if (result.status === 'delivered') {
          return;
        }
      }

      // Nothing available or all failed
      await this.log(report._id, 'none', { 
        status: 'skipped', 
        providerResponse: { reason: 'No channels available or opted-in' }
      });

    } catch (error) {
      logger.error(`[Orchestrator] Fatal error orchestrating report ${report._id}:`, error);
    }
  }

  async log(reportId, channel, result) {
    try {
      await NotificationLog.create({
        reportId,
        channel,
        status: result.status,
        providerResponse: result.providerResponse
      });
    } catch (error) {
      logger.error(`[Orchestrator] Failed to save log for ${reportId} channel ${channel}`, error);
    }
  }
}

module.exports = new NotificationOrchestrator();
