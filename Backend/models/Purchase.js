import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
      unique: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    supplierName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },

    totalCost: {
      type: Number,
      default: 0,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Pending", "Received", "Cancelled"],
      default: "Pending",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-generate Purchase ID and total cost
purchaseSchema.pre("save", async function (next) {
  if (!this.purchaseId) {
    const count = await mongoose.model("Purchase").countDocuments();
    this.purchaseId = `PUR-${String(count + 1).padStart(4, "0")}`;
  }

  this.totalCost = this.quantity * this.unitCost;

  next();
});

export default mongoose.model("Purchase", purchaseSchema);