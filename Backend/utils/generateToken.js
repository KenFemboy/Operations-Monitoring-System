// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      branch: user.branch || null,
      branchId: user.branchId || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};