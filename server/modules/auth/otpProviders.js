const { logger } = require('../../middleware/logger');

class BaseOTPProvider {
  async sendOTP(phone, otp) {
    throw new Error('Not implemented');
  }
}

class DevOTPProvider extends BaseOTPProvider {
  async sendOTP(phone, otp) {
    logger.info(`[DEV MODE] Sending OTP ${otp} to phone ${phone}`);
    return true;
  }
}

class Msg91Provider extends BaseOTPProvider {
  async sendOTP(phone, otp) {
    // TODO: Wire up actual MSG91 API call
    logger.info(`[MSG91] Mock sending OTP ${otp} to phone ${phone}`);
    return true;
  }
}

const getOTPProvider = () => {
  const provider = process.env.OTP_PROVIDER || 'dev';
  switch (provider.toLowerCase()) {
    case 'msg91':
      return new Msg91Provider();
    case 'dev':
    default:
      return new DevOTPProvider();
  }
};

module.exports = {
  getOTPProvider
};
