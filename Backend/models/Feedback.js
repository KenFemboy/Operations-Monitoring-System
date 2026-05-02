import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;