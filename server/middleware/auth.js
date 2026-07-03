const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/response');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key');
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

const requireOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    return sendError(res, 'Forbidden: Owner access required', 403);
  }
};

module.exports = {
  requireAuth,
  requireOwner
};
