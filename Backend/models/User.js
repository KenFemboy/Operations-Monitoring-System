// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["super_admin", "admin"],
      default: "sales",
    },

    branch: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "admin";
      },
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return this.role !== "super_admin" && !this.branch;
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
