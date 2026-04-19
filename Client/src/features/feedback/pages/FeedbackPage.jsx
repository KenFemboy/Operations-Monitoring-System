import FeedbackCard from '../components/FeedbackCard'
import useFeedback from '../hooks/useFeedback'
import { useBranchContext } from '../../shared/store/branchContext'
import { useMemo } from 'react'

function FeedbackPage() {
  const rows = useFeedback()
  const { activeBranch } = useBranchContext()
  const overallRating = useMemo(() => {
    if (!rows.length) return 0

    const total = rows.reduce((sum, item) => sum + item.rating, 0)
    return (total / rows.length).toFixed(1)
  }, [rows])

  return (
    <section>
      <header className="page-header">
        <h1>Feedback</h1>
        <p>Review customer sentiment for {activeBranch}</p>
      </header>
      <section className="card" style={{ marginBottom: '1rem' }}>
        <h3>Overall Rating</h3>
        <p className="value">⭐ {overallRating} / 5</p>
      </section>
      <section className="feedback-grid">
        {rows.map((item) => (
          <FeedbackCard key={item.id} feedback={item} />
        ))}
      </section>
    </section>
  )
}

export default FeedbackPage
