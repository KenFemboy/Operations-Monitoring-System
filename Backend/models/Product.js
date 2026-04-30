import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minimumStock: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Low Stock", "Out of Stock"],
      default: "Out of Stock",
    },
  },
  { timestamps: true }
);

// Auto-generate Product ID
productSchema.pre("save", async function (next) {
  if (!this.productId) {
    const count = await mongoose.model("Product").countDocuments();
    this.productId = `PROD-${String(count + 1).padStart(4, "0")}`;
  }

  if (this.currentStock === 0) {
    this.status = "Out of Stock";
  } else if (this.currentStock <= this.minimumStock) {
    this.status = "Low Stock";
  } else {
    this.status = "Available";
  }

  next();
});

export default mongoose.model("Product", productSchema);