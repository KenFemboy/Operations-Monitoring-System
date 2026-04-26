// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["console_user", "admin", "super_admin", "sales", "hr"],
      default: "console_user",
    },

    branch: {
      type: String,
      trim: true,
      required: function () {
        return false;
      },
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return false;
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
