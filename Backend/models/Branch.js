import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true,
    trim: true
    },
    region: {
    type: String,
    trim: true
    },
    provinceCity: {
    type: String,
    trim: true
    },
    municipality: {
    type: String,
    trim: true
    },
    specificLocation: {
    type: String,
    trim: true
    },
    location: {
    type: String,
    trim: true
    },
    address: {
    type: String,
    trim: true
    },
    description: String,
}, { timestamps: true });

export default mongoose.model("Branch", branchSchema);