import mongoose from "mongoose";

const plantillaSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    requiredCount: {
      type: Number,
      required: true,
      default: 0,
    },

    currentCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["open", "filled", "understaffed", "overstaffed"],
      default: "open",
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },

    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    archiveReason: {
      type: String,
      default: "",
    },

    restoredAt: {
      type: Date,
      default: null,
    },

    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plantilla", plantillaSchema);
