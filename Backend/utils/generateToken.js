// utils/generateToken.js
import jwt from "jsonwebtoken";
import { normalizeRole } from "./roles.js";

export const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: normalizeRole(user.role),
      branch: user.branch || null,
      branchId: user.branchId || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
