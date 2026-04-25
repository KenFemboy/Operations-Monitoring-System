import { useState } from "react";
import AddBranchModal from "../../components/superadmin/AddBranchModal";

export default function SuperadminBranchesPage() {
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  return (
    <>
      <section className="sd-page">
        <div className="sd-section-header">
          <div>
            <h1 className="sd-page-title">Branches</h1>
            <p className="sd-page-subtitle">
              View all branches managed across different admin accounts.
            </p>
          </div>

          <button
            type="button"
            className="sd-btn sd-btn-primary"
            onClick={() => setIsAddBranchOpen(true)}
          >
            Add Branch
          </button>
        </div>

        <section className="sd-empty-card" aria-live="polite">
          <h2 className="sd-empty-title">No branches available</h2>
          <p className="sd-empty-text">
            Branch records will appear here once branches are added.
          </p>
        </section>
      </section>

      {isAddBranchOpen ? (
        <AddBranchModal onClose={() => setIsAddBranchOpen(false)} />
      ) : null}
    </>
  );
}
