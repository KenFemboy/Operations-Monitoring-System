import Plantilla from "../../models/Plantilla.js";
import mongoose from "mongoose";

export const create = async (data) => {
  const plantilla = new Plantilla(data);
  return await plantilla.save();
};

export const findAll = async () => {
  return await Plantilla.find()
    .populate("branchId", "branchName location")
    .lean();
};

export const findById = async (id) => {
  return await Plantilla.findById(id)
    .populate("branchId", "branchName location");
};

export const findByBranchId = async (branchId) => {
  return await Plantilla.find({ branchId })
    .lean();
};

export const update = async (id, data) => {
  return await Plantilla.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("branchId", "branchName location");
};

export const delete_ = async (id) => {
  return await Plantilla.findByIdAndDelete(id);
};

export const count = async () => {
  return await Plantilla.countDocuments();
};

export const updateFilledCount = async (id, count) => {
  return await Plantilla.findByIdAndUpdate(
    id,
    { filledCount: count },
    { new: true, runValidators: true }
  )
    .populate("branchId", "branchName location");
};

export const getPlantillaStats = async (branchId) => {
  return await Plantilla.aggregate([
    { $match: { branchId: mongoose.Types.ObjectId(branchId) } },
    {
      $group: {
        _id: "$branchId",
        totalRequired: { $sum: "$requiredCount" },
        totalFilled: { $sum: "$filledCount" },
        totalAllowance: { $sum: { $multiply: ["$allowance", "$requiredCount"] } },
        totalBaseSalary: {
          $sum: { $multiply: ["$baseSalary", "$requiredCount"] },
        },
        positions: { $sum: 1 },
      },
    },
  ]);
};
