export const computeRates = (employee) => {
  const dailyRate = employee.basicSalary / 26;
  const hourlyRate = dailyRate / 8;

  return { dailyRate, hourlyRate };
};

export const computeEarnings = (metrics, rates, employee) => {
  const basicPay = rates.dailyRate * metrics.daysWorked;

  const overtimePay =
    metrics.overtimeHours * rates.hourlyRate * 1.25;

  const allowances = employee.allowances || 0;

  const grossPay = basicPay + overtimePay + allowances;

  return { basicPay, overtimePay, allowances, grossPay };
};

export const computeDeductions = (metrics, rates) => {
  const lateDeduction =
    (metrics.lateMinutes / 60) * rates.hourlyRate;

  const undertimeDeduction =
    (metrics.undertimeMinutes / 60) * rates.hourlyRate;

  const absenceDeduction =
    rates.dailyRate * metrics.absentDays;

  return {
    lateDeduction,
    undertimeDeduction,
    absenceDeduction,
  };
};

export const computeContributions = (salary) => {
  // Simplified (replace with real PH tables)
  return {
    sss: salary * 0.045,
    philhealth: salary * 0.02,
    pagibig: 100,
  };
};

export const computeTax = (salary) => {
  if (salary <= 20833) return 0;
  if (salary <= 33333) return (salary - 20833) * 0.2;

  return 2500 + (salary - 33333) * 0.25;
};