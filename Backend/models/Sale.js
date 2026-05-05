import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    saleDate: {
      type: String,
      required: true,
    },

    serviceType: {
      type: String,
      enum: ["lunch", "dinner"],
      required: true,
    },

    customerName: {
      type: String,
      default: "",
    },

    customerType: {
      type: String,
      enum: ["kid", "adultUnder4ft", "adult"],
      required: true,
    },

    isSenior: {
      type: Boolean,
      default: false,
    },

    isPWD: {
      type: Boolean,
      default: false,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;