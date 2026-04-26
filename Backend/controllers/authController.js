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

export const tempSuperAdminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    const tempEmail = process.env.TEMP_SUPERADMIN_EMAIL || "superadmin@ally.local";
    const tempPassword = process.env.TEMP_SUPERADMIN_PASSWORD || "12345678";

    if (!password) {
      return res.status(400).json({ message: "Super admin password is required" });
    }

    if (password !== tempPassword) {
      return res.status(401).json({ message: "Invalid super admin password" });
    }

    let user = await User.findOne({ email: tempEmail });

    if (!user) {
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        name: "Ally Super Admin",
        email: tempEmail,
        password: hashedPassword,
        role: "super_admin",
        branchId: null,
      });
    } else {
      const shouldResetPassword = !(await bcrypt.compare(tempPassword, user.password));

      if (shouldResetPassword) {
        user.password = await bcrypt.hash(tempPassword, 10);
      }

      if (user.name !== "Ally Super Admin") {
        user.name = "Ally Super Admin";
      }

      if (user.role !== "super_admin") {
        user.role = "super_admin";
      }

      if (user.branchId) {
        user.branchId = null;
      }

      if (shouldResetPassword || user.isModified("name") || user.isModified("role") || user.isModified("branchId")) {
        await user.save();
      }
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
    const { name, email, password, branch, branchName, superadminPassword } = req.body;
    const selectedBranchName = branchName || branch;

    if (!name || !email || !password || !selectedBranchName || !superadminPassword) {
      return res.status(400).json({
        message: "Name, email, password, branchName, and superadmin password are required",
      });
    }

    const assignedBranch = await Branch.findOne({ branchName: selectedBranchName });
    if (!assignedBranch) {
      return res.status(400).json({ message: "Invalid branch assignment" });
    }

    const superAdmin = await User.findById(req.user.id);

    if (!superAdmin || superAdmin.role !== "super_admin") {
      return res.status(403).json({ message: "Only superadmin can create users" });
    }

    const isSuperAdminPasswordValid = await bcrypt.compare(
      superadminPassword,
      superAdmin.password,
    );

    if (!isSuperAdminPasswordValid) {
      return res.status(401).json({ message: "Invalid superadmin password" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      branch: assignedBranch.branchName,
      branchId: assignedBranch._id,
    });

    return res.status(201).json({
      message: "Admin user created successfully",
      user: sanitizeUser(adminUser),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAdminUserAssignment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { branch, branchName, superadminPassword, name, email } = req.body;
    const selectedBranchName = (branchName || branch || "").trim();

    if (!selectedBranchName || !superadminPassword) {
      return res.status(400).json({
        message: "branchName and superadmin password are required",
      });
    }

    const superAdmin = await User.findById(req.user.id);

    if (!superAdmin || superAdmin.role !== "super_admin") {
      return res.status(403).json({ message: "Only superadmin can edit admin users" });
    }

    const isSuperAdminPasswordValid = await bcrypt.compare(
      superadminPassword,
      superAdmin.password,
    );

    if (!isSuperAdminPasswordValid) {
      return res.status(401).json({ message: "Invalid superadmin password" });
    }

    const adminUser = await User.findById(userId);

    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    if (adminUser.role !== "admin") {
      return res.status(400).json({ message: "Only admin users can be reassigned" });
    }

    const assignedBranch = await Branch.findOne({ branchName: selectedBranchName.trim() });

    if (!assignedBranch) {
      return res.status(400).json({ message: "Invalid branch assignment" });
    }

    if (typeof name === "string" && name.trim()) {
      adminUser.name = name.trim();
    }

    if (typeof email === "string" && email.trim() && email.trim() !== adminUser.email) {
      const duplicateUser = await User.findOne({ email: email.trim() });

      if (duplicateUser && String(duplicateUser._id) !== String(adminUser._id)) {
        return res.status(409).json({ message: "Email already exists" });
      }

      adminUser.email = email.trim();
    }

    adminUser.branch = assignedBranch.branchName;
    adminUser.branchId = assignedBranch._id;

    await adminUser.save();
    await adminUser.populate("branchId");

    return res.status(200).json({
      message: "Admin user updated successfully",
      user: sanitizeUser(adminUser),
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