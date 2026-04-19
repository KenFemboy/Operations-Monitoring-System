import { useMemo, useState } from 'react'
import FeedbackCard from '../components/FeedbackCard'
import useFeedback from '../hooks/useFeedback'

function FeedbackPage() {
  const rows = useFeedback()
  const [branchFilter, setBranchFilter] = useState('All')

  const branchOptions = useMemo(() => {
    return ['All', ...new Set(rows.map((row) => row.branch))]
  }, [rows])

  const filteredRows = rows.filter(
    (row) => branchFilter === 'All' || row.branch === branchFilter,
  )

  return (
    <section>
      <header className="page-header">
        <h1>Feedback</h1>
        <p>Review customer sentiment by branch</p>
      </header>
      <section className="card" style={{ marginBottom: '1rem' }}>
        <div className="form-group" style={{ maxWidth: '260px', marginBottom: 0 }}>
          <label htmlFor="feedbackBranchFilter">Filter by Branch</label>
          <select
            id="feedbackBranchFilter"
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
          >
            {branchOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="feedback-grid">
        {filteredRows.map((item) => (
          <FeedbackCard key={item.id} feedback={item} />
        ))}
      </section>
    </section>
  )
}

export default FeedbackPage
