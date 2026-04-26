import mongoose from "mongoose";

const archiveEntrySchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["branch", "user"],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ArchiveEntry", archiveEntrySchema);