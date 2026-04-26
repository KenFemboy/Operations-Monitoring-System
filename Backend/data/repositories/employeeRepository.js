import Employee from "../../models/Employee.js";

export const count = () => Employee.countDocuments();

export const findByEmployeeId = (employeeId) =>
  Employee.findOne({ employeeId }).select("_id");

export const create = (data) => Employee.create(data);

export const findAll = () =>
  Employee.find({})
    .populate("assignedBranchId", "branchName location")
    .sort({ createdAt: -1 });

export const findByBranchId = (branchId) =>
  Employee.find({ assignedBranchId: branchId })
    .populate("assignedBranchId", "branchName location")
    .sort({ createdAt: -1 });

export const update = (id, data) =>
  Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("positionId", "name baseSalary dailyRate status")

