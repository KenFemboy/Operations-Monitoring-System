import { useContext, useEffect, useRef, useState } from "react";
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

const appendFormDataValue = (formData, key, value) => {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      appendFormDataValue(formData, `${key}.${nestedKey}`, nestedValue);
    });
    return;
  }

  formData.append(key, value);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function EmployeeForm({ branches = [], onSubmit, selectedEmployee, onCancelEdit }) {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );

  const [form, setForm] = useState(getEmptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [sourcePhotoFile, setSourcePhotoFile] = useState(null);
  const [sourcePhotoPreviewUrl, setSourcePhotoPreviewUrl] = useState("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [photoCropBox, setPhotoCropBox] = useState({ x: 0, y: 0, size: 0 });
  const [cropDrag, setCropDrag] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const cropImageRef = useRef(null);
  const isEditing = Boolean(selectedEmployee);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile]);

  useEffect(() => {
    if (!sourcePhotoFile) {
      setSourcePhotoPreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(sourcePhotoFile);
    setSourcePhotoPreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [sourcePhotoFile]);

  useEffect(() => {
    if (!cropDrag) return undefined;

    const handlePointerMove = (event) => {
      const image = cropImageRef.current;
      if (!image) return;

      const width = image.clientWidth;
      const height = image.clientHeight;
      const dx = event.clientX - cropDrag.startX;
      const dy = event.clientY - cropDrag.startY;

      setPhotoCropBox(() => {
        if (cropDrag.mode === "resize") {
          const maxSize = Math.min(
            width - cropDrag.startBox.x,
            height - cropDrag.startBox.y
          );
          const size = clamp(
            cropDrag.startBox.size + Math.max(dx, dy),
            80,
            maxSize
          );

          return {
            ...cropDrag.startBox,
            size,
          };
        }

        return {
          ...cropDrag.startBox,
          x: clamp(
            cropDrag.startBox.x + dx,
            0,
            width - cropDrag.startBox.size
          ),
          y: clamp(
            cropDrag.startBox.y + dy,
            0,
            height - cropDrag.startBox.size
          ),
        };
      });
    };

    const handlePointerUp = () => setCropDrag(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [cropDrag]);

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
        setPhotoFile(null);
        setSourcePhotoFile(null);
        setIsCropModalOpen(false);
        setPhotoCropBox({ x: 0, y: 0, size: 0 });
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
      setPhotoFile(null);
      setSourcePhotoFile(null);
      setIsCropModalOpen(false);
      setPhotoCropBox({ x: 0, y: 0, size: 0 });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [branches, selectedEmployee, isSuperAdmin, user]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const selectedFile = files?.[0] || null;
      setSourcePhotoFile(selectedFile);
      setIsCropModalOpen(Boolean(selectedFile));
      setPhotoCropBox({ x: 0, y: 0, size: 0 });
      return;
    }

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
    setPhotoFile(null);
    setSourcePhotoFile(null);
    setIsCropModalOpen(false);
    setPhotoCropBox({ x: 0, y: 0, size: 0 });
    setFileInputKey((current) => current + 1);
  };

  const handleCropImageLoad = (event) => {
    const image = event.currentTarget;
    const size = Math.min(image.clientWidth, image.clientHeight) * 0.8;

    setPhotoCropBox({
      x: (image.clientWidth - size) / 2,
      y: (image.clientHeight - size) / 2,
      size,
    });
  };

  const startCropDrag = (mode, event) => {
    event.preventDefault();
    event.stopPropagation();

    setCropDrag({
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startBox: photoCropBox,
    });
  };

  const createCroppedPhotoFile = () =>
    new Promise((resolve, reject) => {
      const renderedImage = cropImageRef.current;

      if (!sourcePhotoFile || !sourcePhotoPreviewUrl || !renderedImage?.clientWidth) {
        resolve(null);
        return;
      }

      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 720;
        canvas.width = size;
        canvas.height = size;

        const ratioX = image.naturalWidth / renderedImage.clientWidth;
        const ratioY = image.naturalHeight / renderedImage.clientHeight;
        const sourceX = photoCropBox.x * ratioX;
        const sourceY = photoCropBox.y * ratioY;
        const sourceSize = photoCropBox.size * Math.min(ratioX, ratioY);

        const context = canvas.getContext("2d");
        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          size,
          size
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Unable to crop employee photo"));
              return;
            }

            resolve(
              new File([blob], "employee-photo.webp", {
                type: "image/webp",
                lastModified: Date.now(),
              })
            );
          },
          "image/webp",
          0.9
        );
      };

      image.onerror = () => reject(new Error("Unable to load employee photo"));
      image.src = sourcePhotoPreviewUrl;
    });

  const handleConfirmCrop = async () => {
    try {
      const croppedPhoto = await createCroppedPhotoFile();

      if (croppedPhoto) {
        setPhotoFile(croppedPhoto);
      }

      setSourcePhotoFile(null);
      setIsCropModalOpen(false);
      setPhotoCropBox({ x: 0, y: 0, size: 0 });
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to crop employee photo");
    }
  };

  const handleCancelCrop = () => {
    setSourcePhotoFile(null);
    setIsCropModalOpen(false);
    setPhotoCropBox({ x: 0, y: 0, size: 0 });
    setFileInputKey((current) => current + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const basicRate = Number(form.basicRate || 0);
    const allowance = Number(form.allowance || 0);

    const payload = {
      ...form,
      phone: form.phoneNumber,
      salaryRate: basicRate,
      basicRate,
      allowance,
      age: Number(form.age || 0),
      sssId: form.sss,
      philhealthId: form.philhealth,
      pagibigId: form.pagibig,
    };
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      appendFormDataValue(formData, key, value);
    });

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    onSubmit(formData);

    if (!isEditing) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

      <div className="employee-form-sections">
        <section className="employee-form-section employee-section-basic">
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
            <label className="employee-field">
              <span>Employee Photo</span>
              <input
                key={fileInputKey}
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
              />
            </label>
            {photoPreviewUrl && (
              <div className="employee-field employee-field-full" style={styles.selectedPhotoPanel}>
                <img
                  src={photoPreviewUrl}
                  alt="Selected employee"
                  style={styles.selectedPhotoPreview}
                />
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => {
                    setPhotoFile(null);
                    setFileInputKey((current) => current + 1);
                  }}
                >
                  Remove Photo
                </button>
              </div>
            )}
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

        <section className="employee-form-section employee-section-compliance">
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

        <section className="employee-form-section employee-section-education">
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

      {isCropModalOpen && sourcePhotoPreviewUrl && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalPanel}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Crop Employee Photo</h3>
                <p style={styles.modalText}>
                  Drag the square to choose the photo area, then save the crop.
                </p>
              </div>
              <button
                type="button"
                style={styles.iconButton}
                onClick={handleCancelCrop}
                aria-label="Close crop modal"
              >
                x
              </button>
            </div>

            <div style={styles.cropPanel}>
              <div style={styles.cropStage}>
                <img
                  ref={cropImageRef}
                  src={sourcePhotoPreviewUrl}
                  alt="Employee crop preview"
                  style={styles.cropImage}
                  onLoad={handleCropImageLoad}
                />
                {photoCropBox.size > 0 && (
                  <div
                    style={{
                      ...styles.cropBox,
                      left: `${photoCropBox.x}px`,
                      top: `${photoCropBox.y}px`,
                      width: `${photoCropBox.size}px`,
                      height: `${photoCropBox.size}px`,
                    }}
                    onPointerDown={(event) => startCropDrag("move", event)}
                  >
                    <span
                      style={styles.cropHandle}
                      onPointerDown={(event) => startCropDrag("resize", event)}
                    />
                  </div>
                )}
              </div>
              <div style={styles.cropControls}>
                <label style={styles.cropControl}>
                  <span>Crop Size</span>
                  <input
                    type="range"
                    min="80"
                    max={Math.min(
                      cropImageRef.current?.clientWidth || 220,
                      cropImageRef.current?.clientHeight || 220
                    )}
                    value={photoCropBox.size || 80}
                    onChange={(event) => {
                      const image = cropImageRef.current;
                      if (!image) return;

                      const size = Number(event.target.value);
                      setPhotoCropBox((current) => ({
                        ...current,
                        size,
                        x: clamp(current.x, 0, image.clientWidth - size),
                        y: clamp(current.y, 0, image.clientHeight - size),
                      }));
                    }}
                  />
                </label>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button type="button" style={styles.cancelButton} onClick={handleCancelCrop}>
                Cancel
              </button>
              <button type="button" style={styles.saveCropButton} onClick={handleConfirmCrop}>
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn employee-save-btn">
          {isEditing ? "Update Employee" : "Save Employee"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  selectedPhotoPanel: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  selectedPhotoPreview: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "20px",
    backgroundColor: "transparent",
    pointerEvents: "none",
  },
  modalPanel: {
    width: "min(720px, 100%)",
    maxHeight: "90vh",
    overflow: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
    pointerEvents: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "start",
    marginBottom: "16px",
  },
  modalTitle: {
    margin: "0 0 4px",
  },
  modalText: {
    margin: 0,
    color: "#64748b",
  },
  iconButton: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  cropPanel: {
    alignItems: "start",
    display: "grid",
    gap: "14px",
    justifyItems: "center",
  },
  cropStage: {
    position: "relative",
    display: "inline-block",
    maxWidth: "100%",
    lineHeight: 0,
    userSelect: "none",
    overflow: "hidden",
    borderRadius: "12px",
  },
  cropBox: {
    position: "absolute",
    border: "2px solid #2563eb",
    boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.42)",
    boxSizing: "border-box",
    cursor: "move",
    borderRadius: "12px",
    touchAction: "none",
  },
  cropHandle: {
    position: "absolute",
    right: "-8px",
    bottom: "-8px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    border: "2px solid #ffffff",
    cursor: "nwse-resize",
  },
  cropImage: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "58vh",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f3f4f6",
  },
  cropControls: {
    display: "grid",
    gap: "10px",
    width: "min(100%, 420px)",
  },
  cropControl: {
    display: "grid",
    gap: "4px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "18px",
  },
  saveCropButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#22c55e",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 8px 18px rgba(34, 197, 94, 0.28)",
  },
  cancelButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#f97316",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 8px 18px rgba(249, 115, 22, 0.28)",
  },
  secondaryButton: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default EmployeeForm;
