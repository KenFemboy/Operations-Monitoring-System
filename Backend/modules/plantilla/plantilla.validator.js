export const validateCreatePlantilla = (data) => {
  const errors = {};

  if (!data.branchId || data.branchId.trim() === "") {
    errors.branchId = "Branch ID is required";
  }

  if (!data.role || data.role.trim() === "") {
    errors.role = "Role is required";
  }

  if (!data.baseSalary || data.baseSalary <= 0) {
    errors.baseSalary = "Base salary must be greater than 0";
  }

  if (data.allowance && data.allowance < 0) {
    errors.allowance = "Allowance cannot be negative";
  }

  if (data.requiredCount && data.requiredCount < 1) {
    errors.requiredCount = "Required count must be at least 1";
  }

  if (data.status && !["active", "inactive"].includes(data.status)) {
    errors.status = "Status must be either 'active' or 'inactive'";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdatePlantilla = (data) => {
  const errors = {};

  if (data.baseSalary && data.baseSalary <= 0) {
    errors.baseSalary = "Base salary must be greater than 0";
  }

  if (data.allowance !== undefined && data.allowance < 0) {
    errors.allowance = "Allowance cannot be negative";
  }

  if (data.requiredCount && data.requiredCount < 1) {
    errors.requiredCount = "Required count must be at least 1";
  }

  if (data.status && !["active", "inactive"].includes(data.status)) {
    errors.status = "Status must be either 'active' or 'inactive'";
  }

  if (data.filledCount !== undefined && data.filledCount < 0) {
    errors.filledCount = "Filled count cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
