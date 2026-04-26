import * as employeeRepo from "../../data/repositories/employeeRepository.js";
import {
  getPlantillaByBranchAndRole,
  syncFilledCountsForEmployeeChange,
  validateEmployeeAssignment,
} from "../plantilla/plantilla.service.js";

const EMPLOYEE_ID_PREFIX = "EMP";
const ACTIVE_STATUS = "active";

export const generateEmployeeId = async () => {
  const totalEmployees = await employeeRepo.count();
  let sequence = totalEmployees + 1;

  while (true) {
    const employeeId = `${EMPLOYEE_ID_PREFIX}-${String(sequence).padStart(5, "0")}`;
    const exists = await employeeRepo.findByEmployeeId(employeeId);

    if (!exists) {
      return employeeId;
    }

    sequence += 1;
  }
};

const prepareEmployeePayload = async (data) => {
  let plantillaId = data.plantillaId;

  if (!plantillaId && data.assignedBranchId && data.role) {
    const plantilla = await getPlantillaByBranchAndRole(data.assignedBranchId, data.role);
    plantillaId = plantilla?._id;
  }

  const plantilla = await validateEmployeeAssignment({
    plantillaId,
    branchId: data.assignedBranchId,
  });

  return {
    ...data,
    role: plantilla.role,
    assignedBranchId: plantilla.branchId,
    plantillaId: plantilla._id,
  };
};

export const createEmployee = async (data) => {
  const payload = await prepareEmployeePayload(data);
  const employee = await employeeRepo.create(payload);

  if (employee.status === ACTIVE_STATUS && employee.plantillaId) {
    await syncFilledCountsForEmployeeChange(employee.plantillaId);
  }

  return employee;
};

export const getEmployees = () => employeeRepo.findAll();

export const getEmployeesByBranchId = (branchId) =>
  employeeRepo.findByBranchId(branchId);

export const updateEmployee = async (id, data) => {
  const currentEmployee = await employeeRepo.findById(id);

  if (!currentEmployee) {
    return null;
  }

  let payload = { ...data };

  if (!payload.plantillaId && (payload.role || payload.assignedBranchId)) {
    const nextBranchId = payload.assignedBranchId || currentEmployee.assignedBranchId;
    const nextRole = payload.role || currentEmployee.role;
    const plantilla = await getPlantillaByBranchAndRole(nextBranchId, nextRole);
    payload.plantillaId = plantilla?._id;
  }

  if (
    payload.plantillaId &&
    String(payload.plantillaId) !== String(currentEmployee.plantillaId || "")
  ) {
    const plantilla = await validateEmployeeAssignment({
      plantillaId: payload.plantillaId,
      branchId: payload.assignedBranchId || currentEmployee.assignedBranchId,
    });

    payload = {
      ...payload,
      role: plantilla.role,
      assignedBranchId: plantilla.branchId,
      plantillaId: plantilla._id,
    };
  }

  const previousPlantillaId = currentEmployee.plantillaId;
  const wasActive = currentEmployee.status === ACTIVE_STATUS;
  const employee = await employeeRepo.update(id, payload);
  const isActive = employee.status === ACTIVE_STATUS;

  const changedPlantilla =
    String(previousPlantillaId || "") !== String(employee.plantillaId || "");
  const changedActiveStatus = wasActive !== isActive;

  if (changedPlantilla || changedActiveStatus) {
    await syncFilledCountsForEmployeeChange(previousPlantillaId, employee.plantillaId);
  }

  return employee;
};

export const deactivateEmployee = async (id) => {
  return updateEmployee(id, { status: "inactive" });
};
