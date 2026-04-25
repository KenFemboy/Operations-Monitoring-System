/**
 * Calculate vacancy status for a plantilla entry
 * @param {number} requiredCount - Number of positions required
 * @param {number} filledCount - Number of positions filled
 * @returns {object} Vacancy information
 */
export const calculateVacancy = (requiredCount, filledCount) => {
  const vacant = requiredCount - filledCount;
  const vacancyRate = (vacant / requiredCount) * 100;

  return {
    vacant,
    vacancyRate: vacancyRate.toFixed(2),
    isFull: vacant === 0,
  };
};

/**
 * Calculate total compensation (salary + allowance)
 * @param {number} baseSalary - Base salary
 * @param {number} allowance - Allowance amount
 * @param {number} count - Number of positions
 * @returns {object} Compensation breakdown
 */
export const calculateCompensation = (baseSalary, allowance, count) => {
  const totalBaseSalary = baseSalary * count;
  const totalAllowance = allowance * count;
  const totalCompensation = totalBaseSalary + totalAllowance;

  return {
    totalBaseSalary,
    totalAllowance,
    totalCompensation,
    perPositionTotal: baseSalary + allowance,
  };
};

/**
 * Format plantilla data for frontend
 * @param {array} plantillas - Array of plantilla documents
 * @returns {array} Formatted plantilla data
 */
export const formatPlantillaForDisplay = (plantillas) => {
  return plantillas.map((p) => ({
    id: p._id,
    branch: p.branchId.branchName,
    position: p.positionId.name,
    role: p.role,
    baseSalary: `PHP ${p.baseSalary.toLocaleString()}`,
    allowance: `PHP ${p.allowance.toLocaleString()}`,
    required: p.requiredCount,
    filled: p.filledCount,
    ...calculateVacancy(p.requiredCount, p.filledCount),
  }));
};

/**
 * Get plantilla occupancy percentage
 * @param {number} filled - Filled positions
 * @param {number} required - Required positions
 * @returns {number} Occupancy percentage
 */
export const getOccupancyPercentage = (filled, required) => {
  if (required === 0) return 0;
  return ((filled / required) * 100).toFixed(2);
};

/**
 * Check if plantilla is fully staffed
 * @param {number} filled - Filled positions
 * @param {number} required - Required positions
 * @returns {boolean} True if fully staffed
 */
export const isFullyStaffed = (filled, required) => {
  return filled >= required;
};

/**
 * Generate plantilla summary for a branch
 * @param {array} plantillas - Array of plantilla documents
 * @returns {object} Summary statistics
 */
export const generateBranchSummary = (plantillas) => {
  let totalRequired = 0;
  let totalFilled = 0;
  let totalCompensation = 0;
  let departmentCount = new Set();

  plantillas.forEach((p) => {
    totalRequired += p.requiredCount;
    totalFilled += p.filledCount;
    totalCompensation +=
      (p.baseSalary + p.allowance) * p.requiredCount;
    if (p.positionId?.department) {
      departmentCount.add(p.positionId.department);
    }
  });

  return {
    totalPositions: plantillas.length,
    totalRequired,
    totalFilled,
    totalVacancies: totalRequired - totalFilled,
    occupancyRate: getOccupancyPercentage(totalFilled, totalRequired),
    totalCompensation,
    averageCompensationPerPosition:
      plantillas.length > 0 ? (totalCompensation / plantillas.length).toFixed(2) : 0,
    departments: departmentCount.size,
  };
};
