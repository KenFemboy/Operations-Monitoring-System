import * as plantillaRepo from "../../data/repositories/plantillaRepository.js";
import Plantilla from "../../models/Plantilla.js";
import mongoose from "mongoose";

export const createPlantilla = async (data) => {
  try {
    const plantilla = await plantillaRepo.create(data);
    return plantilla;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error(
        "A plantilla entry already exists for this branch and position"
      );
    }
    throw error;
  }
};

export const getAllPlantilla = async () => {
  return await plantillaRepo.findAll();
};

export const getPlantillaById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid plantilla ID");
  }
  const plantilla = await plantillaRepo.findById(id);
  if (!plantilla) {
    throw new Error("Plantilla not found");
  }
  return plantilla;
};

export const getPlantillaByBranch = async (branchId) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }
  return await plantillaRepo.findByBranchId(branchId);
};

export const updatePlantilla = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid plantilla ID");
  }
  const plantilla = await plantillaRepo.update(id, data);
  if (!plantilla) {
    throw new Error("Plantilla not found");
  }
  return plantilla;
};

export const deletePlantilla = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid plantilla ID");
  }
  const plantilla = await plantillaRepo.delete_(id);
  if (!plantilla) {
    throw new Error("Plantilla not found");
  }
  return plantilla;
};

export const getPlantillaStats = async (branchId) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }
  const stats = await plantillaRepo.getPlantillaStats(branchId);
  return stats.length > 0 ? stats[0] : null;
};

export const updateFilledCount = async (plantillaId, count) => {
  if (!mongoose.Types.ObjectId.isValid(plantillaId)) {
    throw new Error("Invalid plantilla ID");
  }
  if (count < 0) {
    throw new Error("Filled count cannot be negative");
  }
  const plantilla = await plantillaRepo.findById(plantillaId);
  if (!plantilla) {
    throw new Error("Plantilla not found");
  }
  if (count > plantilla.requiredCount) {
    throw new Error("Filled count cannot exceed required count");
  }
  return await plantillaRepo.updateFilledCount(plantillaId, count);
};

export const calculateTotalCost = async (branchId) => {
  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new Error("Invalid branch ID");
  }
  const plantillas = await plantillaRepo.findByBranchId(branchId);

  let totalSalary = 0;
  let totalAllowance = 0;

  plantillas.forEach((p) => {
    totalSalary += p.baseSalary * p.requiredCount;
    totalAllowance += p.allowance * p.requiredCount;
  });

  return {
    totalBaseSalary: totalSalary,
    totalAllowance: totalAllowance,
    grandTotal: totalSalary + totalAllowance,
  };
};
