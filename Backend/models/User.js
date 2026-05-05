import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "superadmin", "admin", "console_user"],
      default: "admin",
    },

    branch: {
      type: String,
      ref: "Branch",
      default: null,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      required: function () {
        return this.role === "console_user";
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
