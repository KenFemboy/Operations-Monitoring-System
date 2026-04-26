import * as employeeRepo from "../../data/repositories/employeeRepository.js";

const EMPLOYEE_ID_PREFIX = "EMP";

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

export const createEmployee = (data) => employeeRepo.create(data);

export const getEmployees = () => employeeRepo.findAll();

export const getEmployeesByBranchId = (branchId) =>
  employeeRepo.findByBranchId(branchId);

export const updateEmployee = (id, data) => employeeRepo.update(id, data);
