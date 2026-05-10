import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const calculateAge = (value) => {
  if (!value) return "";
  const birthdate = new Date(value);
  if (Number.isNaN(birthdate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age -= 1;
  }

  return age > 0 ? String(age) : "";
};

const getBranchIdFromUser = (user) => {
  if (!user?.branchId) return "";
  if (typeof user.branchId === "object") return user.branchId._id || "";
  return user.branchId;
};

const normalizeGender = (value) => {
  if (value === "M") return "Male";
  if (value === "F") return "Female";
  return value || "";
};

const getOptionValue = (value, options) =>
  options.includes(value) ? value : "";

const MARITAL_STATUS_OPTIONS = ["Single", "In a relationship", "Seperated"];
const EDUCATIONAL_ATTAINMENT_OPTIONS = ["Elementary", "Highschool", "College"];
const EMPLOYMENT_OPTIONS = ["Regular", "Probationary"];
const GENDER_OPTIONS = ["Male", "Female"];

const getEmptyForm = () => ({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  position: "",
  branchId: "",
  assignedBranch: "",
  employmentStatus: "active",
  dateHired: "",
  gender: "",
  birthdate: "",
  age: "",
  maritalStatus: "",
  religion: "",
  permanentAddress: "",
  nbiPoliceClearance: "not submitted",
  healthCard: "lacking",
  educationalAttainment: "",
  courseSpecification: "",
  schoolName: "",
  schoolPeriod: "",
  emergencyContact: {
    fullName: "",
    relationship: "",
    contactNumber: "",
  },
  previousWorkExperience: {
    position: "",
    companyName: "",
    tenure: "",
  },
  sss: "",
  philhealth: "",
  pagibig: "",
  tin: "",
  basicRate: "",
  allowance: "",
  modeOfSalary: "",
  employmentContract: "",
});

function EmployeeForm({ branches = [], onSubmit, selectedEmployee, onCancelEdit }) {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );

  const [form, setForm] = useState(getEmptyForm);
  const isEditing = Boolean(selectedEmployee);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const defaultBranch = {
        branchId: isSuperAdmin ? "" : getBranchIdFromUser(user),
        assignedBranch: isSuperAdmin ? "" : user?.branchName || user?.branch || "",
      };

      if (!selectedEmployee) {
        setForm({
          ...getEmptyForm(),
          ...defaultBranch,
        });
        return;
      }

      const selectedBranchName =
        selectedEmployee.branch?.branchName ||
        selectedEmployee.assignedBranch ||
        "";
      const selectedBranchId =
        selectedEmployee.branch?._id ||
        selectedEmployee.branch ||
        branches.find((branch) => branch.branchName === selectedBranchName)?._id ||
        "";
      const birthdate = formatDate(selectedEmployee.birthdate);

      setForm({
        ...getEmptyForm(),
        firstName: selectedEmployee.firstName || "",
        middleName: selectedEmployee.middleName || "",
        lastName: selectedEmployee.lastName || "",
        email: selectedEmployee.email || "",
        phoneNumber: selectedEmployee.phoneNumber || selectedEmployee.phone || "",
        position: selectedEmployee.position || "",
        branchId: isSuperAdmin ? selectedBranchId : getBranchIdFromUser(user),
        assignedBranch: isSuperAdmin
          ? selectedBranchName
          : user?.branchName || user?.branch || "",
        employmentStatus: selectedEmployee.employmentStatus || "active",
        dateHired: formatDate(selectedEmployee.dateHired),
        gender: getOptionValue(normalizeGender(selectedEmployee.gender), GENDER_OPTIONS),
        birthdate,
        age: calculateAge(birthdate),
        maritalStatus: getOptionValue(
          selectedEmployee.maritalStatus,
          MARITAL_STATUS_OPTIONS
        ),
        religion: selectedEmployee.religion || "",
        permanentAddress: selectedEmployee.permanentAddress || "",
        nbiPoliceClearance: selectedEmployee.nbiPoliceClearance || "not submitted",
        healthCard: selectedEmployee.healthCard || "lacking",
        educationalAttainment: getOptionValue(
          selectedEmployee.educationalAttainment,
          EDUCATIONAL_ATTAINMENT_OPTIONS
        ),
        courseSpecification: selectedEmployee.courseSpecification || "",
        schoolName: selectedEmployee.schoolName || "",
        schoolPeriod: selectedEmployee.schoolPeriod || "",
        emergencyContact: {
          fullName: selectedEmployee.emergencyContact?.fullName || "",
          relationship: selectedEmployee.emergencyContact?.relationship || "",
          contactNumber: selectedEmployee.emergencyContact?.contactNumber || "",
        },
        previousWorkExperience: {
          position: selectedEmployee.previousWorkExperience?.position || "",
          companyName: selectedEmployee.previousWorkExperience?.companyName || "",
          tenure: selectedEmployee.previousWorkExperience?.tenure || "",
        },
        sss: selectedEmployee.sss || selectedEmployee.sssId || "",
        philhealth: selectedEmployee.philhealth || selectedEmployee.philhealthId || "",
        pagibig: selectedEmployee.pagibig || selectedEmployee.pagibigId || "",
        tin: selectedEmployee.tin || "",
        basicRate: selectedEmployee.basicRate ?? selectedEmployee.salaryRate ?? "",
        allowance: selectedEmployee.allowance ?? "",
        modeOfSalary: selectedEmployee.modeOfSalary || "",
        employmentContract: getOptionValue(
          selectedEmployee.employmentContract,
          EMPLOYMENT_OPTIONS
        ),
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [branches, selectedEmployee, isSuperAdmin, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setForm((current) => ({
        ...current,
        [group]: {
          ...current[group],
          [field]: value,
        },
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "birthdate" ? { age: calculateAge(value) } : {}),
    }));
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    const selectedBranch = branches.find((branch) => branch._id === branchId);

    setForm((current) => ({
      ...current,
      branchId,
      assignedBranch: selectedBranch?.branchName || "",
    }));
  };

  const resetForm = () => {
    setForm({
      ...getEmptyForm(),
      branchId: isSuperAdmin ? "" : getBranchIdFromUser(user),
      assignedBranch: isSuperAdmin ? "" : user?.branchName || user?.branch || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const basicRate = Number(form.basicRate || 0);
    const allowance = Number(form.allowance || 0);

    onSubmit({
      ...form,
      phone: form.phoneNumber,
      salaryRate: basicRate,
      basicRate,
      allowance,
      age: Number(form.age || 0),
      sssId: form.sss,
      philhealthId: form.philhealth,
      pagibigId: form.pagibig,
    });

    if (!isEditing) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section">
          <h4>Basic Information</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>First Name</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label className="employee-field">
              <span>Middle Name</span>
              <input name="middleName" value={form.middleName} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Last Name</span>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label className="employee-field">
              <span>Position</span>
              <input name="position" value={form.position} onChange={handleChange} required />
            </label>
            {isSuperAdmin ? (
              <label className="employee-field">
                <span>Branch</span>
                <select name="branchId" value={form.branchId} onChange={handleBranchChange} required>
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.branchName} - {branch.location}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="employee-field">
                <span>Branch</span>
                <input name="assignedBranch" value={form.assignedBranch} onChange={handleChange} disabled />
              </label>
            )}
            <label className="employee-field">
              <span>Employment Status</span>
              <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="employee-field">
              <span>Date Hired</span>
              <input type="date" name="dateHired" value={form.dateHired} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="employee-field">
              <span>Birthdate</span>
              <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Age</span>
              <input type="number" name="age" value={form.age} readOnly min="0" />
            </label>
            <label className="employee-field">
              <span>Marital Status</span>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Seperated">Seperated</option>
              </select>
            </label>
            <label className="employee-field">
              <span>Religion</span>
              <input name="religion" value={form.religion} onChange={handleChange} />
            </label>
            <label className="employee-field employee-field-full">
              <span>Permanent Address</span>
              <textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Compliance / Documents</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>NBI / Police Clearance</span>
              <select name="nbiPoliceClearance" value={form.nbiPoliceClearance} onChange={handleChange}>
                <option value="submitted">Submitted</option>
                <option value="not submitted">Not Submitted</option>
              </select>
            </label>
            <label className="employee-field">
              <span>Health Card</span>
              <select name="healthCard" value={form.healthCard} onChange={handleChange}>
                <option value="submitted">Submitted</option>
                <option value="lacking">Lacking</option>
              </select>
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Education</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Educational Attainment</span>
              <select name="educationalAttainment" value={form.educationalAttainment} onChange={handleChange}>
                <option value="">Select Educational Attainment</option>
                <option value="Elementary">Elementary</option>
                <option value="Highschool">Highschool</option>
                <option value="College">College</option>
              </select>
            </label>
            <label className="employee-field">
              <span>Course Specification</span>
              <input name="courseSpecification" value={form.courseSpecification} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>School Name</span>
              <input name="schoolName" value={form.schoolName} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>School Period</span>
              <input
                name="schoolPeriod"
                value={form.schoolPeriod}
                onChange={handleChange}
                placeholder="2026 to 2027"
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Contacts</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Phone Number</span>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Emergency Contact</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Full Name</span>
              <input name="emergencyContact.fullName" value={form.emergencyContact.fullName} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Relationship</span>
              <input name="emergencyContact.relationship" value={form.emergencyContact.relationship} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Contact Number</span>
              <input name="emergencyContact.contactNumber" value={form.emergencyContact.contactNumber} onChange={handleChange} />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Previous Work Experience</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Position</span>
              <input name="previousWorkExperience.position" value={form.previousWorkExperience.position} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Company Name</span>
              <input name="previousWorkExperience.companyName" value={form.previousWorkExperience.companyName} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Tenure</span>
              <input
                name="previousWorkExperience.tenure"
                value={form.previousWorkExperience.tenure}
                onChange={handleChange}
                placeholder="03/2026 to 05/2027"
              />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Mandatory Government Benefits</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>SSS</span>
              <input name="sss" value={form.sss} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>PhilHealth</span>
              <input name="philhealth" value={form.philhealth} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Pag-IBIG</span>
              <input name="pagibig" value={form.pagibig} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>TIN</span>
              <input name="tin" value={form.tin} onChange={handleChange} />
            </label>
          </div>
        </section>

        <section className="employee-form-section">
          <h4>Compensation</h4>
          <div className="employee-form-grid">
            <label className="employee-field">
              <span>Basic Rate / Daily Rate</span>
              <input type="number" name="basicRate" value={form.basicRate} onChange={handleChange} min="0" step="0.01" />
            </label>
            <label className="employee-field">
              <span>Allowance</span>
              <input type="number" name="allowance" value={form.allowance} onChange={handleChange} min="0" step="0.01" />
            </label>
            <label className="employee-field">
              <span>Mode of Salary</span>
              <input name="modeOfSalary" value={form.modeOfSalary} onChange={handleChange} />
            </label>
            <label className="employee-field">
              <span>Employment</span>
              <select name="employmentContract" value={form.employmentContract} onChange={handleChange}>
                <option value="">Select Employment</option>
                <option value="Regular">Regular</option>
                <option value="Probationary">Probationary</option>
              </select>
            </label>
          </div>
        </section>
      </div>

      <div className="form-actions">
        <button type="submit">
          {isEditing ? "Update Employee" : "Save Employee"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default EmployeeForm;
