import { formatStars } from '../utils/feedbackHelpers'

function FeedbackCard({ feedback }) {
  return (
    <article className="feedback-card">
      <p className="feedback-stars">{formatStars(feedback.rating)}</p>
      <p className="feedback-comment">"{feedback.comment}"</p>
      <p className="feedback-meta">
        {feedback.customerName} - {feedback.branch}
      </p>
    </article>
  )
}

export default FeedbackCard
