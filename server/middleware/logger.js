const fs = require('fs');
const path = require('path');

// Simple custom JSON logger
const logToFile = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta instanceof Error ? { error: meta.message, stack: meta.stack } : meta)
  };
  console.log(JSON.stringify(logEntry));
};

const logger = {
  info: (msg, meta) => logToFile('info', msg, meta),
  error: (msg, meta) => logToFile('error', msg, meta),
  warn: (msg, meta) => logToFile('warn', msg, meta),
};

const redactPII = (obj) => {
  if (!obj) return obj;
  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };
  
  for (const key in redacted) {
    if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactPII(redacted[key]);
    } else if (key.toLowerCase() === 'phone' || key.toLowerCase() === 'password') {
      redacted[key] = '[REDACTED]';
    }
  }
  return redacted;
};

const requestLogger = (req, res, next) => {
  const reqStart = Date.now();
  
  // Intercept response to log it
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - reqStart;
    
    let parsedBody;
    try {
      parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    } catch (e) {
      parsedBody = body;
    }
    
    // We only log if it's an API request, not health checks to avoid noise
    if (req.path !== '/health') {
      logger.info('API Request', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: duration,
        requestBody: (req.body && Object.keys(req.body).length) ? redactPII(req.body) : undefined,
        responseBody: parsedBody ? redactPII(parsedBody) : undefined,
        ip: req.ip
      });
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = { logger, requestLogger, redactPII };
