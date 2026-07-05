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
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('91')) {
      formattedPhone = '91' + formattedPhone;
    }

    // ==========================================
    // TEMPORARY BYPASS: Print OTP to Render Logs
    // ==========================================
    logger.info(`\n=========================================\n[ROADLINK] OTP FOR ${formattedPhone} IS: ${otp}\n(Use this code to login while DLT is pending)\n=========================================\n`);

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    if (!authKey || !templateId) {
      logger.error('MSG91 credentials missing from environment');
      throw new Error('MSG91 configuration missing');
    }

    const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${formattedPhone}&authkey=${authKey}&otp=${otp}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.type === 'error') {
        logger.error(`MSG91 Error: ${JSON.stringify(data)}`);
        throw new Error(data.message || 'Failed to send OTP via MSG91');
      }

      logger.info(`[MSG91] OTP sent successfully to ${formattedPhone}`);
      return true;
    } catch (error) {
      logger.error(`MSG91 Request Failed: ${error.message}`);
      throw error;
    }
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
