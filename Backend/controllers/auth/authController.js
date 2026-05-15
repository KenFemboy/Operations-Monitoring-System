// controllers/authController.js
import User from "../../models/User.js";
import Branch from "../../models/Branch.js";
import ArchiveEntry from "../../models/ArchiveEntry.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import { normalizeUserAuthShape } from "../../utils/branchAccess.js";
import { normalizeRole } from "../../utils/roles.js";

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  return normalizeUserAuthShape(userDoc);
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, branchId } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "console_user",
      branchId: branchId || null,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token: generateToken(user),
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    const user = await User.findOne({ email: loginIdentifier }).populate(
      "branchId",
      "branchName location address status"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Only branch users need a branch.
    // Super admin can login without branchId.
    if (normalizeRole(user.role) === "console_user" && !user.branchId) {
      return res.status(403).json({
        success: false,
        message: "This user has no assigned branch. Please contact the super admin.",
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, branch, branchName, branchId } = req.body;
    const role = ["admin", "console_user"].includes(normalizeRole(req.body.role))
      ? normalizeRole(req.body.role)
      : "console_user";
    const authorizationPassword =
      req.body.authorizationPassword || req.body.superadminPassword;
    const selectedBranchName = branchName || branch;

    if (
      !name ||
      !email ||
      !password ||
      (!selectedBranchName && !branchId) ||
      !authorizationPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password, branch, and authorization password are required",
      });
    }

    const assignedBranch = branchId
      ? await Branch.findById(branchId)
      : await Branch.findOne({
          branchName: selectedBranchName,
        });

    if (!assignedBranch) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch assignment",
      });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization password" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      branch: assignedBranch.branchName,
      branchId: assignedBranch._id,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const updateAdminUserAssignment = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      branch,
      branchName,
      branchId,
      name,
      email,
      password,
      role: rawRole,
    } = req.body;
    const nextRole = ["admin", "console_user"].includes(normalizeRole(rawRole))
      ? normalizeRole(rawRole)
      : "console_user";

    const authorizationPassword =
      req.body.authorizationPassword || req.body.superadminPassword;

    if (!authorizationPassword) {
      return res.status(400).json({
        success: false,
        message: "Authorization password is required",
      });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password
    );

    if (!isAuthorizationPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization password",
      });
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Do not update super admin through this branch-admin update route
    if (normalizeRole(targetUser.role) === "superadmin") {
      return res.status(400).json({
        success: false,
        message: "Super admin does not need a branch assignment",
      });
    }

    let assignedBranch = null;

    // Prefer branchId if frontend sends it
    if (branchId) {
      assignedBranch = await Branch.findById(branchId);
    }

    // Fallback to branchName / branch
    if (!assignedBranch) {
      const selectedBranchName = (branchName || branch || "").trim();

      if (selectedBranchName) {
        assignedBranch = await Branch.findOne({
          branchName: selectedBranchName,
        });
      }
    }

    if (!assignedBranch) {
      return res.status(400).json({
        success: false,
        message: "Valid branch assignment is required",
      });
    }

    if (typeof name === "string" && name.trim()) {
      targetUser.name = name.trim();
    }

    if (
      typeof email === "string" &&
      email.trim() &&
      email.trim() !== targetUser.email
    ) {
      const duplicateUser = await User.findOne({
        email: email.trim(),
      });

      if (
        duplicateUser &&
        String(duplicateUser._id) !== String(targetUser._id)
      ) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      targetUser.email = email.trim();
    }

    targetUser.role = nextRole;
    targetUser.branch = assignedBranch.branchName;
    targetUser.branchId = assignedBranch._id;

    if (typeof password === "string" && password.trim()) {
      if (password.trim().length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }

      targetUser.password = await bcrypt.hash(password.trim(), 10);
    }

    await targetUser.save();

    await targetUser.populate(
      "branchId",
      "branchName location address status"
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: sanitizeUser(targetUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const authorizationPassword =
      req.body.authorizationPassword || req.body.superadminPassword;

    if (!authorizationPassword) {
      return res.status(400).json({
        success: false,
        message: "Authorization password is required",
      });
    }

    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Current user not found",
      });
    }

    const isAuthorizationPasswordValid = await bcrypt.compare(
      authorizationPassword,
      currentUser.password,
    );

    if (!isAuthorizationPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization password" });
    }

    const targetUser = await User.findById(userId).populate("branchId");

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (normalizeRole(targetUser.role) === "superadmin") {
      return res
        .status(403)
        .json({ success: false, message: "Super admin user cannot be deleted" });
    }

    if (String(targetUser._id) === String(currentUser._id)) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own account" });
    }

    await ArchiveEntry.create({
      entityType: "user",
      entityId: String(targetUser._id),
      displayName: targetUser.name,
      snapshot: sanitizeUser(targetUser),
      deletedBy: currentUser._id,
    });

    await User.deleteOne({ _id: targetUser._id });

    return res.status(200).json({
      success: true,
      message: "User deleted and archived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("branchId");

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("branchId");

    res.json({
      success: true,
      count: users.length,
      data: users.map(sanitizeUser),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("branchId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


export const getBranchAdmins = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["admin", "console_user"] },
    })
      .populate("branchId", "branchName location address status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(sanitizeUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch branch admins",
      error: error.message,
    });
  }
};
