import { useState, useEffect } from 'react'
import styles from './PlantillaForm.module.css'

function PlantillaForm({ onSubmit, initialData = null, isLoading = false, branches = [] }) {
  const [formData, setFormData] = useState({
    branchId: '',
    role: '',
    department: '',
    baseSalary: '',
    allowance: '',
    requiredCount: 1,
    status: 'active',
    description: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        branchId: initialData.branchId || '',
        role: initialData.role || '',
        department: initialData.department || '',
        baseSalary: initialData.baseSalary || '',
        allowance: initialData.allowance || '',
        requiredCount: initialData.requiredCount || 1,
        status: initialData.status || 'active',
        description: initialData.description || '',
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.branchId.trim()) {
      newErrors.branchId = 'Branch is required'
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required'
    }

    if (!formData.baseSalary || parseFloat(formData.baseSalary) <= 0) {
      newErrors.baseSalary = 'Base salary must be greater than 0'
    }

    if (formData.allowance !== '' && parseFloat(formData.allowance) < 0) {
      newErrors.allowance = 'Allowance cannot be negative'
    }

    if (!formData.requiredCount || parseInt(formData.requiredCount) < 1) {
      newErrors.requiredCount = 'Required count must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      branchId: formData.branchId,
      role: formData.role.trim(),
      department: formData.department.trim(),
      baseSalary: parseFloat(formData.baseSalary),
      allowance: formData.allowance === '' ? 0 : parseFloat(formData.allowance),
      requiredCount: parseInt(formData.requiredCount),
      status: formData.status,
      description: formData.description.trim(),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="branchId" className={styles.label}>
          Branch *
        </label>
        <select
          id="branchId"
          name="branchId"
          value={formData.branchId}
          onChange={handleChange}
          className={`${styles.input} ${errors.branchId ? styles.error : ''}`}
        >
          <option value="">Select a branch</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.branchName}
            </option>
          ))}
        </select>
        {errors.branchId && <span className={styles.errorMessage}>{errors.branchId}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>
          Role *
        </label>
        <input
          id="role"
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Branch Manager, HR Officer"
          className={`${styles.input} ${errors.role ? styles.error : ''}`}
        />
        {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="department" className={styles.label}>
          Department
        </label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g., HR, Operations"
          className={styles.input}
        />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="baseSalary" className={styles.label}>
            Base Salary *
          </label>
          <input
            id="baseSalary"
            type="number"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`${styles.input} ${errors.baseSalary ? styles.error : ''}`}
          />
          {errors.baseSalary && <span className={styles.errorMessage}>{errors.baseSalary}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="allowance" className={styles.label}>
            Allowance
          </label>
          <input
            id="allowance"
            type="number"
            name="allowance"
            value={formData.allowance}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`${styles.input} ${errors.allowance ? styles.error : ''}`}
          />
          {errors.allowance && <span className={styles.errorMessage}>{errors.allowance}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="requiredCount" className={styles.label}>
          Required Count *
        </label>
        <input
          id="requiredCount"
          type="number"
          name="requiredCount"
          value={formData.requiredCount}
          onChange={handleChange}
          min="1"
          className={`${styles.input} ${errors.requiredCount ? styles.error : ''}`}
        />
        {errors.requiredCount && (
          <span className={styles.errorMessage}>{errors.requiredCount}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description for this role..."
          className={styles.textarea}
          rows="4"
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Saving...' : 'Save Plantilla'}
        </button>
      </div>
    </form>
  )
}

export default PlantillaForm
