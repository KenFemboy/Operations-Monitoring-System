import mongoose from "mongoose";

const plantillaSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
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
  },
  { timestamps: true }
);

export default mongoose.model("Plantilla", plantillaSchema);