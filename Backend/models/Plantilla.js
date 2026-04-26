import mongoose from "mongoose";

const plantillaSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    requiredCount: {
      type: Number,
      required: true,
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