// controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Validate branch requirement
    if (role !== "super_admin" && !branchId) {
      return res.status(400).json({ message: "Branch is required" });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branchId: role === "super_admin" ? null : branchId,
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
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("branchId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      success: true,
      user,
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};