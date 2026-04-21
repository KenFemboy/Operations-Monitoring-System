// controllers/employeeController.js
import Employee from "../models/Employee.js";

const generateUniqueEmployeeId = async () => {
  const year = new Date().getFullYear();
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const candidateId = `EMP-${year}-${randomDigits}`;
    const exists = await Employee.exists({ employeeId: candidateId });

    if (!exists) {
      return candidateId;
    }
  }

  throw new Error("Unable to generate unique employeeId. Please try again.");
};

export const createEmployee = async (req, res) => {
    try {
      const payload = { ...req.body };
      const personalKeys = [
        "firstName",
        "lastName",
        "middleName",
        "gender",
        "birthDate",
        "contactNumber",
        "email",
        "address",
      ];

      // Support flat payloads by mapping personal fields into personalInfo.
      if (!payload.personalInfo || typeof payload.personalInfo !== "object") {
        payload.personalInfo = {};
      }

      personalKeys.forEach((key) => {
        if (payload[key] !== undefined && payload.personalInfo[key] === undefined) {
          payload.personalInfo[key] = payload[key];
        }
        delete payload[key];
      });

      // Auto-generate employeeId when client does not provide one.
      if (!payload.employeeId) {
        payload.employeeId = await generateUniqueEmployeeId();
      }

      const employee = new Employee(payload);
      const saved = await employee.save();
  
      res.status(201).json({
        success: true,
        data: saved
      });
  
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  };

  export const getEmployees = async (req, res) => {
    try {
      const { status, department } = req.query;
  
      let filter = {};
  
      if (status) filter["employmentInfo.status"] = status;
      if (department) filter["employmentInfo.department"] = department;
  
      const employees = await Employee.find(filter)
        .populate("employmentInfo.position")
        .populate("employmentInfo.department")
        .sort({ createdAt: -1 });
  
      res.json({
        success: true,
        count: employees.length,
        data: employees
      });
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getEmployeeById = async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id)
        .populate("employmentInfo.position")
        .populate("employmentInfo.department");
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.json({ success: true, data: employee });
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  export const updateEmployee = async (req, res) => {
    try {
      const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      res.json({
        success: true,
        data: updated
      });
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  export const deleteEmployee = async (req, res) => {
    try {
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        { "employmentInfo.status": "terminated" },
        { new: true }
      );
  
      res.json({
        success: true,
        message: "Employee terminated",
        data: employee
      });
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };