// controllers/authController.js
import User from "../models/User.js";
import Branch from "../models/Branch.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;

  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    branch: userDoc.branchId?.branchName || userDoc.branch || null,
    branchId: userDoc.branchId,
  };
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "console_user", branchId } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branchId: branchId || null,
    });

    // 5. Return response (no password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Email/username and password are required" });
    }

    const user = await User.findOne({ email: loginIdentifier }).populate("branchId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, branch, branchName } = req.body;
    const authorizationPassword = req.body.authorizationPassword || req.body.superadminPassword;
    const selectedBranchName = branchName || branch;

    if (!name || !email || !password || !selectedBranchName || !authorizationPassword) {
      return res.status(400).json({
        message: "Name, email, password, branchName, and authorization password are required",
      });
    }

    const assignedBranch = await Branch.findOne({ branchName: selectedBranchName });
    if (!assignedBranch) {
      return res.status(400).json({ message: "Invalid branch assignment" });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({ message: "Current user not found" });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({ message: "Invalid authorization password" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "console_user",
      branch: assignedBranch.branchName,
      branchId: assignedBranch._id,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdminUserAssignment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { branch, branchName, name, email, password } = req.body;
    const authorizationPassword = req.body.authorizationPassword || req.body.superadminPassword;
    const selectedBranchName = (branchName || branch || "").trim();

    if (!selectedBranchName || !authorizationPassword) {
      return res.status(400).json({
        message: "branchName and authorization password are required",
      });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({ message: "Current user not found" });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({ message: "Invalid authorization password" });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const assignedBranch = await Branch.findOne({ branchName: selectedBranchName.trim() });

    if (!assignedBranch) {
      return res.status(400).json({ message: "Invalid branch assignment" });
    }

    if (typeof name === "string" && name.trim()) {
      targetUser.name = name.trim();
    }

    if (typeof email === "string" && email.trim() && email.trim() !== targetUser.email) {
      const duplicateUser = await User.findOne({ email: email.trim() });

      if (duplicateUser && String(duplicateUser._id) !== String(targetUser._id)) {
        return res.status(409).json({ message: "Email already exists" });
      }

      targetUser.email = email.trim();
    }

    targetUser.branch = assignedBranch.branchName;
    targetUser.branchId = assignedBranch._id;

    if (typeof password === "string" && password.trim()) {
      if (password.trim().length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      targetUser.password = await bcrypt.hash(password.trim(), 10);
    }

    await targetUser.save();
    await targetUser.populate("branchId");

    return res.status(200).json({
      message: "User updated successfully",
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("branchId");

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("branchId");

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id)
      .populate("branchId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
