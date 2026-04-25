import styles from './PlantillaCard.module.css'

function PlantillaCard({ plantilla, onEdit, onDelete, onViewDetails }) {
  const vacancyRate = plantilla.requiredCount > 0 
    ? (((plantilla.requiredCount - plantilla.filledCount) / plantilla.requiredCount) * 100).toFixed(1)
    : 0
  
  const occupancyRate = plantilla.requiredCount > 0
    ? ((plantilla.filledCount / plantilla.requiredCount) * 100).toFixed(1)
    : 0

  const totalSalaryCost = (plantilla.baseSalary + plantilla.allowance) * plantilla.requiredCount

  return (
    <div className={`${styles.card} ${styles[plantilla.status]}`}>
      <div className={styles.header}>
        <div className={styles.roleSection}>
          <h3 className={styles.role}>{plantilla.role}</h3>
          <span className={`${styles.status} ${styles[plantilla.status]}`}>
            {plantilla.status.charAt(0).toUpperCase() + plantilla.status.slice(1)}
          </span>
        </div>
        <div className={styles.actions}>
          {onEdit && (
            <button className={styles.actionButton} onClick={onEdit} title="Edit">
              ✎
            </button>
          )}
          {onDelete && (
            <button className={styles.actionButton} onClick={onDelete} title="Delete">
              ✕
            </button>
          )}
        </div>
      </div>

      {plantilla.description && (
        <p className={styles.description}>{plantilla.description}</p>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.label}>Base Salary</span>
          <span className={styles.value}>₱ {plantilla.baseSalary.toLocaleString()}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>Allowance</span>
          <span className={styles.value}>₱ {plantilla.allowance.toLocaleString()}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>Required</span>
          <span className={styles.value}>{plantilla.requiredCount}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.label}>Filled</span>
          <span className={styles.value}>{plantilla.filledCount}</span>
        </div>
      </div>

      <div className={styles.staffingSection}>
        <div className={styles.staffingMetric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Occupancy Rate</span>
            <span className={styles.metricValue}>{occupancyRate}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progress} 
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        <div className={styles.staffingMetric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Vacancy Rate</span>
            <span className={styles.metricValue}>{vacancyRate}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progress} ${styles.vacancy}`}
              style={{ width: `${vacancyRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalCost}>
          <span className={styles.label}>Monthly Cost (Total)</span>
          <span className={styles.costValue}>₱ {totalSalaryCost.toLocaleString()}</span>
        </div>
        {onViewDetails && (
          <button className={styles.detailsButton} onClick={onViewDetails}>
            View Details →
          </button>
        )}
      </div>
    </div>
  )
}

export default PlantillaCard
