import { generatePayroll } from "../modules/payroll/payroll.service.js";
import Payroll from "../models/Payroll.js";

export const generatePayrollController = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const payrolls = await generatePayroll(
      startDate,
      endDate,
      req.user.id
    );

    res.json({
      message: "Payroll generated successfully",
      data: payrolls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayrolls = async (req, res) => {
  const payrolls = await Payroll.find()
    .populate("employee")
    .sort({ createdAt: -1 });

  res.json(payrolls);
};

export const getEmployeePayroll = async (req, res) => {
  const payrolls = await Payroll.find({
    employee: req.params.employeeId,
  });

  res.json(payrolls);
};

export const updatePayrollStatus = async (req, res) => {
  const { status } = req.body;

  const payroll = await Payroll.findByIdAndUpdate(
    req.params.id,
    { status, paidAt: status === "paid" ? new Date() : null },
    { new: true }
  );

  res.json(payroll);
};