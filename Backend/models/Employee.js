import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    photoUrl: {
      type: String,
      default: "",
    },

    photoPath: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    assignedBranch: {
      type: String,
      required: true,
      trim: true,
    },

    salaryRate: {
      type: Number,
      default: 0,
    },

    basicRate: {
      type: Number,
      default: 0,
    },

    allowance: {
      type: Number,
      default: 0,
    },

    modeOfSalary: {
      type: String,
      trim: true,
    },

    employmentContract: {
      type: String,
      enum: ["Regular", "Probationary", ""],
      default: "",
      trim: true,
    },

    sssId: {
      type: String,
      trim: true,
    },

    gsisId: {
      type: String,
      trim: true,
    },

    pagibigId: {
      type: String,
      trim: true,
    },

    philhealthId: {
      type: String,
      trim: true,
    },

    sss: {
      type: String,
      trim: true,
    },

    philhealth: {
      type: String,
      trim: true,
    },

    pagibig: {
      type: String,
      trim: true,
    },

    tin: {
      type: String,
      trim: true,
    },

    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "resigned", "terminated"],
      default: "active",
    },

    dateHired: {
      type: Date,
      default: Date.now,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", ""],
      default: "",
    },

    birthdate: {
      type: Date,
    },

    age: {
      type: Number,
      default: 0,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "In a relationship", "Seperated", ""],
      default: "",
      trim: true,
    },

    religion: {
      type: String,
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },

    nbiPoliceClearance: {
      type: String,
      enum: ["submitted", "not submitted"],
      default: "not submitted",
    },

    healthCard: {
      type: String,
      enum: ["submitted", "lacking"],
      default: "lacking",
    },

    educationalAttainment: {
      type: String,
      enum: ["Elementary", "Highschool", "College", ""],
      default: "",
      trim: true,
    },

    courseSpecification: {
      type: String,
      trim: true,
    },

    schoolName: {
      type: String,
      trim: true,
    },

    schoolPeriod: {
      type: String,
      match: [/^\d{4}\s+to\s+\d{4}$|^$/, "School period must use YYYY to YYYY format"],
      trim: true,
    },

    emergencyContact: {
      fullName: { type: String, trim: true },
      relationship: { type: String, trim: true },
      contactNumber: { type: String, trim: true },
    },

    previousWorkExperience: {
      position: { type: String, trim: true },
      companyName: { type: String, trim: true },
      tenure: {
        type: String,
        match: [/^\d{2}\/\d{4}\s+to\s+\d{2}\/\d{4}$|^$/, "Tenure must use MM/YYYY to MM/YYYY format"],
        trim: true,
      },
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },

    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    archiveReason: {
      type: String,
      default: "",
    },

    restoredAt: {
      type: Date,
      default: null,
    },

    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
