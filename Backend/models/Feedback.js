import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    mealSession: {
      type: String,
      required: true,
      enum: ["Lunch", "Dinner"],
    },

    serviceType: {
      type: String,
      enum: ["Lunch", "Dinner", ""],
      default: "",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    concernPhoto: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    imagePath: {
      type: String,
      default: "",
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

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
