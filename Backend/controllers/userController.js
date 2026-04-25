import User from "../models/User.js";

const sanitizeUser = (userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  branch: userDoc.branch || userDoc.branchId?.branchName || null,
  branchId: userDoc.branchId,
});

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("branchId");

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("branchId");
    const sanitizedUsers = users.map(sanitizeUser);

    res.json({
      success: true,
      count: sanitizedUsers.length,
      data: sanitizedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};