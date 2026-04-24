import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true,
    trim: true
    },
    location: {
    type: String,
    trim: true
    },
    description: String,
}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);