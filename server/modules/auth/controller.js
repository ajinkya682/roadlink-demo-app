const OtpSession = require('../../models/OtpSession');
const User = require('../../models/User');
const { getOTPProvider } = require('./otpProviders');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');
const { sendSuccess, sendError } = require('../../utils/response');
const { logger } = require('../../middleware/logger');

const otpProvider = getOTPProvider();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

exports.requestOtp = async (req, res) => {
  try {
    const { name, phone, isLogin } = req.body;
    if (!phone || !/^\+91\d{10}$/.test(phone)) {
      return sendError(res, 'Valid Indian phone number with +91 is required');
    }

    // Rate limit resend (60s cooldown)
    const existing = await OtpSession.findOne({ phone });
    if (existing) {
      const timeDiff = Date.now() - (existing.expiresAt.getTime() - 5 * 60 * 1000); // Created time approx
      if (timeDiff < 60000) {
        return sendError(res, 'Please wait 60 seconds before requesting a new OTP', 429);
      }
    }

    if (isLogin) {
      const user = await User.findOne({ phone });
      if (!user) {
        // Return 200 OK with a special flag so the browser doesn't log a red 404 error,
        // but the frontend knows to switch to the signup tab.
        return res.status(200).json({
          success: false,
          requireSignup: true,
          error: { message: 'Phone number not registered. Please sign up.' }
        });
      }
    }

    const otp = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await OtpSession.findOneAndUpdate(
      { phone },
      { name, otp, expiresAt },
      { upsert: true, new: true }
    );

    // Development only: Print OTP to console
    console.log(`[DEV] Generated OTP for ${phone}: ${otp}`);

    await otpProvider.sendOTP(phone, otp);

    return sendSuccess(res, { message: 'OTP sent successfully' });
  } catch (error) {
    logger.error('Error in requestOtp:', error);
    return sendError(res, 'Failed to send OTP', 500);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return sendError(res, 'Phone and OTP are required');

    const session = await OtpSession.findOne({ phone });
    if (!session || session.otp !== otp) {
      return sendError(res, 'Invalid or expired OTP', 400);
    }

    // OTP matched, upsert user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, name: session.name, role: 'owner' });
    } else if (session.name && !user.name) {
      user.name = session.name;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshTokenStr = generateRefreshToken();

    // In a real app, hash the refresh token. 
    // const crypto = require('crypto');
    // const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const tokenHash = refreshTokenStr; // Using raw for MVP simplicity or implement hashing

    user.refreshTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      deviceInfo: req.headers['user-agent']
    });

    await user.save();
    await OtpSession.deleteOne({ phone });

    return sendSuccess(res, {
      accessToken,
      refreshToken: refreshTokenStr,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    logger.error('Error in verifyOtp:', error);
    return sendError(res, 'Failed to verify OTP', 500);
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token required');

    const user = await User.findOne({ 'refreshTokens.tokenHash': refreshToken });
    if (!user) return sendError(res, 'Invalid refresh token', 401);

    const tokenDoc = user.refreshTokens.find(t => t.tokenHash === refreshToken);
    if (tokenDoc.expiresAt < new Date()) {
      user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash !== refreshToken);
      await user.save();
      return sendError(res, 'Refresh token expired', 401);
    }

    const accessToken = generateAccessToken(user._id, user.role);
    return sendSuccess(res, { accessToken });
  } catch (error) {
    logger.error('Error in refresh:', error);
    return sendError(res, 'Failed to refresh token', 500);
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    if (!refreshToken) return sendError(res, 'Refresh token required');

    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { tokenHash: refreshToken } }
    });

    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Error in logout:', error);
    return sendError(res, 'Failed to logout', 500);
  }
};
