import Employee from "../../models/Employee.js";

export const count = () => Employee.countDocuments();

export const findByEmployeeId = (employeeId) =>
  Employee.findOne({ employeeId }).select("_id");

export const findById = (id) => Employee.findById(id);

export const create = (data) => Employee.create(data);

export const findAll = () =>
  Employee.find({})
    .populate("assignedBranchId", "branchName location")
    .populate("plantillaId", "role baseSalary allowance requiredCount filledCount")
    .sort({ createdAt: -1 });

export const findByBranchId = (branchId) =>
  Employee.find({ assignedBranchId: branchId })
    .populate("assignedBranchId", "branchName location")
    .populate("plantillaId", "role baseSalary allowance requiredCount filledCount")
    .sort({ createdAt: -1 });

export const update = (id, data) =>
  Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("assignedBranchId", "branchName location")
    .populate("plantillaId", "role baseSalary allowance requiredCount filledCount")
