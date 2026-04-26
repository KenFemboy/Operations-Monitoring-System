import Button from '../../shared/components/Button'
import { getReportDescription } from '../utils/reportHelpers'

function ReportActionButtons({ actions }) {
  return (
    <div className="action-row">
      {actions.map((action) => (
        <Button key={action.id} variant="outline">
          {getReportDescription(action.label)}
        </Button>
      ))}
    </div>
  )
}

export default ReportActionButtons
