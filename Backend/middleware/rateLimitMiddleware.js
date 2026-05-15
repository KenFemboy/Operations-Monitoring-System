const createMemoryRateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 10,
  message = "Too many requests, please try again later",
} = {}) => {
  const hitsByKey = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
    const current = hitsByKey.get(key) || { count: 0, resetAt: now + windowMs };

    if (current.resetAt <= now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    hitsByKey.set(key, current);

    if (current.count > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    return next();
  };
};

export const publicFeedbackRateLimit = createMemoryRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many feedback submissions from this IP. Please try again later.",
});

