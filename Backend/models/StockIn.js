import mongoose from "mongoose";

const stockInSchema = new mongoose.Schema(
  {
    stockInId: {
      type: String,
      unique: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      enum: ["Purchase", "Return", "Adjustment", "Opening Stock"],
      default: "Purchase",
    },

    referencePurchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    addedBy: {
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

stockInSchema.pre("save", async function (next) {
  if (!this.stockInId) {
    const count = await mongoose.model("StockIn").countDocuments();
    this.stockInId = `SIN-${String(count + 1).padStart(4, "0")}`;
  }

  next();
});

export default mongoose.model("StockIn", stockInSchema);