import Employee from "../../models/Employee.js";

export const count = () => Employee.countDocuments();

export const findByEmployeeId = (employeeId) =>
  Employee.findOne({ employeeId }).select("_id");

export const create = (data) => Employee.create(data);

export const findAll = () => Employee.find({}).sort({ createdAt: -1 });
