import mongoose from "mongoose";

const stockOutSchema = new mongoose.Schema(
  {
    stockOutId: {
      type: String,
      unique: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      enum: ["Used", "Damaged", "Expired", "Wasted", "Adjustment"],
      default: "Used",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    releasedBy: {
      type: String,
      default: "Admin",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

stockOutSchema.pre("save", async function (next) {
  if (!this.stockOutId) {
    const count = await mongoose.model("StockOut").countDocuments();
    this.stockOutId = `SOUT-${String(count + 1).padStart(4, "0")}`;
  }

  next();
});

export default mongoose.model("StockOut", stockOutSchema);