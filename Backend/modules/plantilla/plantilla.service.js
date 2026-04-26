import Employee from "../../models/Employee.js";
import Plantilla from "../../models/Plantilla.js";
import { assertValidObjectId } from "../../middleware/accessControl.js";

const ACTIVE_STATUS = "active";

const normalizeRole = (role) => (typeof role === "string" ? role.trim() : "");

const toObjectIdValue = (value) => value?._id || value;

const mapDuplicateRoleError = (error) => {
  if (error?.code === 11000) {
    const duplicateError = new Error("Plantilla role already exists for this branch");
    duplicateError.statusCode = 409;
    return duplicateError;
  }

  return error;
};

const formatPlantillaPayload = (payload) => ({
  branchId: payload.branchId,
  role: normalizeRole(payload.role),
  department: payload.department?.trim() || undefined,
  baseSalary: Number(payload.baseSalary),
  allowance: payload.allowance === undefined ? 0 : Number(payload.allowance),
  requiredCount: Number(payload.requiredCount),
  status: payload.status || ACTIVE_STATUS,
  description: payload.description?.trim() || undefined,
});

export const recalculateFilledCount = async (plantillaId) => {
  assertValidObjectId(plantillaId, "plantillaId");

  const filledCount = await Employee.countDocuments({
    plantillaId,
    status: ACTIVE_STATUS,
  });

  return Plantilla.findByIdAndUpdate(
    plantillaId,
    { filledCount },
    { new: true, runValidators: true }
  ).populate("branchId", "branchName location");
};

export const syncFilledCountsForEmployeeChange = async (...plantillaIds) => {
  const uniqueIds = [
    ...new Set(
      plantillaIds
        .filter(Boolean)
        .map((id) => String(toObjectIdValue(id)))
    ),
  ];

  await Promise.all(uniqueIds.map((id) => recalculateFilledCount(id)));
};

export const createPlantilla = async (payload) => {
  try {
    const plantilla = await Plantilla.create(formatPlantillaPayload(payload));
    return plantilla.populate("branchId", "branchName location");
  } catch (error) {
    throw mapDuplicateRoleError(error);
  }
};

export const getPlantillasByBranch = async (branchId) => {
  assertValidObjectId(branchId, "branchId");

  const plantillas = await Plantilla.find({ branchId })
    .populate("branchId", "branchName location")
    .sort({ role: 1 })
    .lean();

  return plantillas;
};

export const getPlantillaById = async (id) => {
  assertValidObjectId(id, "plantilla id");

  const plantilla = await Plantilla.findById(id).populate("branchId", "branchName location");

  if (!plantilla) {
    const error = new Error("Plantilla not found");
    error.statusCode = 404;
    throw error;
  }

  return plantilla;
};

export const getPlantillaByBranchAndRole = async (branchId, role) => {
  assertValidObjectId(branchId, "branchId");

  return Plantilla.findOne({
    branchId,
    role: normalizeRole(role),
    status: ACTIVE_STATUS,
  });
};

export const checkPlantillaAvailability = async (plantillaId) => {
  const plantilla = await getPlantillaById(plantillaId);

  return (
    plantilla.status === ACTIVE_STATUS &&
    Number(plantilla.filledCount || 0) < Number(plantilla.requiredCount)
  );
};

export const validateEmployeeAssignment = async ({ plantillaId, branchId }) => {
  if (!plantillaId) {
    const error = new Error("plantillaId is required");
    error.statusCode = 400;
    throw error;
  }

  const plantilla = await getPlantillaById(plantillaId);

  if (plantilla.status !== ACTIVE_STATUS) {
    const error = new Error("Plantilla is inactive");
    error.statusCode = 400;
    throw error;
  }

  if (String(toObjectIdValue(plantilla.branchId)) !== String(toObjectIdValue(branchId))) {
    const error = new Error("Employee branch must match plantilla branch");
    error.statusCode = 400;
    throw error;
  }

  if (Number(plantilla.filledCount || 0) >= Number(plantilla.requiredCount)) {
    const error = new Error("Plantilla for this role is full");
    error.statusCode = 400;
    throw error;
  }

  return plantilla;
};

export const getEmployeeSalary = async (employee) => {
  const plantilla = employee.plantillaId
    ? await getPlantillaById(employee.plantillaId)
    : await getPlantillaByBranchAndRole(employee.assignedBranchId, employee.role);

  if (!plantilla || plantilla.status !== ACTIVE_STATUS) {
    const error = new Error("Active plantilla salary structure not found for employee");
    error.statusCode = 400;
    throw error;
  }

  const baseSalary = Number(plantilla.baseSalary);
  const allowance = Number(plantilla.allowance || 0);
  const dailyRate = baseSalary / 22;
  const hourlyRate = dailyRate / 8;

  return {
    baseSalary,
    allowance,
    monthlySalary: baseSalary + allowance,
    dailyRate,
    hourlyRate,
    plantilla,
  };
};

export const updatePlantilla = async (id, payload) => {
  assertValidObjectId(id, "plantilla id");

  const currentPlantilla = await Plantilla.findById(id).lean();

  if (!currentPlantilla) {
    const error = new Error("Plantilla not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    payload.requiredCount !== undefined &&
    Number(payload.requiredCount) < Number(currentPlantilla.filledCount || 0)
  ) {
    const error = new Error("requiredCount cannot be lower than filledCount");
    error.statusCode = 400;
    throw error;
  }

  const updatePayload = { ...payload };

  if (typeof updatePayload.role === "string") {
    updatePayload.role = normalizeRole(updatePayload.role);
  }

  if (typeof updatePayload.department === "string") {
    updatePayload.department = updatePayload.department.trim();
  }

  if (typeof updatePayload.description === "string") {
    updatePayload.description = updatePayload.description.trim();
  }

  try {
    const plantilla = await Plantilla.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate("branchId", "branchName location");

    if (!plantilla) {
      const error = new Error("Plantilla not found");
      error.statusCode = 404;
      throw error;
    }

    return plantilla;
  } catch (error) {
    throw mapDuplicateRoleError(error);
  }
};

export const deletePlantilla = async (id) => {
  assertValidObjectId(id, "plantilla id");

  const plantilla = await Plantilla.findByIdAndUpdate(
    id,
    { status: "inactive" },
    { new: true, runValidators: true }
  ).populate("branchId", "branchName location");

  if (!plantilla) {
    const error = new Error("Plantilla not found");
    error.statusCode = 404;
    throw error;
  }

  return plantilla;
};
