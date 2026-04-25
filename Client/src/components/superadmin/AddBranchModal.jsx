import { useMemo, useState } from "react";

const regionOptions = ["Region Option 1", "Region Option 2", "Region Option 3"];

const locationOptionsByRegion = {
  "Region Option 1": ["Location Option 1", "Location Option 2"],
  "Region Option 2": ["Location Option 1", "Location Option 2"],
  "Region Option 3": ["Location Option 1", "Location Option 2"],
};

export default function AddBranchModal({ onClose }) {
  const [branchName, setBranchName] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");

  const locationOptions = useMemo(
    () => locationOptionsByRegion[region] || [],
    [region],
  );

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setRegion(selectedRegion);
    setLocation("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="sd-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sd-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-branch-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-branch-title" className="sd-modal-title">
          Add Branch
        </h2>
        <p className="sd-modal-subtitle">Create a new branch entry structure.</p>

        <form className="sd-form" onSubmit={handleSave}>
          <label className="sd-label" htmlFor="branch-name">
            Branch Name
          </label>
          <input
            id="branch-name"
            type="text"
            className="sd-input"
            value={branchName}
            onChange={(event) => setBranchName(event.target.value)}
            placeholder="Enter branch name"
          />

          <label className="sd-label" htmlFor="region-select">
            Select Region
          </label>
          <select
            id="region-select"
            className="sd-input"
            value={region}
            onChange={handleRegionChange}
          >
            <option value="">Choose region</option>
            {regionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label className="sd-label" htmlFor="location-select">
            Select Specific Location
          </label>
          <select
            id="location-select"
            className="sd-input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            disabled={!region}
          >
            <option value="">
              {region ? "Choose location" : "Select a region first"}
            </option>
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="sd-form-actions">
            <button type="button" className="sd-btn sd-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sd-btn sd-btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
