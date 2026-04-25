export default function SuperadminEmployeesPage() {
  return (
    <section className="sd-page">
      <div className="sd-section-header">
        <div>
          <h1 className="sd-page-title">Employees - Main Branch</h1>
          <p className="sd-page-subtitle">
            Employees listed here are scoped to the main branch only.
          </p>
        </div>
      </div>

      <section className="sd-empty-card" aria-live="polite">
        <h2 className="sd-empty-title">No employees found</h2>
        <p className="sd-empty-text">
          Employee records for the main branch will appear in this section.
        </p>
      </section>
    </section>
  );
}
