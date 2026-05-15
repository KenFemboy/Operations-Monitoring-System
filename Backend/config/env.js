const WEAK_JWT_SECRETS = new Set(["secret", "123456", "jwtsecret"]);

export const validateRequiredEnv = () => {
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  if (WEAK_JWT_SECRETS.has(jwtSecret.toLowerCase())) {
    throw new Error("JWT_SECRET is too weak. Set a strong secret in .env");
  }
};

