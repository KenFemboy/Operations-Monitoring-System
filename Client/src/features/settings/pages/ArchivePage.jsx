import { useEffect, useMemo, useState } from 'react'
import api from '../../../api/axios'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'

const archiveColumns = [
  { key: 'entityType', label: 'Type' },
  { key: 'displayName', label: 'Record' },
  { key: 'deletedBy', label: 'Deleted By' },
  { key: 'deletedAt', label: 'Deleted At' },
]

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ArchivePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState('')
  const [restorePassword, setRestorePassword] = useState('')
  const [isRestoring, setIsRestoring] = useState(false)
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [clearPassword, setClearPassword] = useState('')
  const [isClearing, setIsClearing] = useState(false)

  const loadArchiveEntries = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/archive')
      setEntries(response.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load archive entries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadArchiveEntries()
  }, [])

  const rows = useMemo(
    () =>
      entries.map((entry) => ({
        id: entry._id,
        entityType: entry.entityType === 'branch' ? 'Branch' : 'User',
        displayName: entry.displayName || '-',
        deletedBy: entry.deletedBy?.name || entry.deletedBy?.email || '-',
        deletedAt: formatDate(entry.deletedAt),
      })),
    [entries],
  )

  const handleRestore = async (event) => {
    event.preventDefault()

    if (!selectedEntryId) {
      setError('Please select an entry to restore')
      return
    }

    try {
      setIsRestoring(true)
      setError('')
      setSuccessMessage('')

      await api.post(`/archive/${selectedEntryId}/restore`, {
        authorizationPassword: restorePassword,
      })

      setSuccessMessage('Record restored successfully.')
      setRestorePassword('')
      setSelectedEntryId('')
      setIsRestoreModalOpen(false)
      await loadArchiveEntries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restore record')
    } finally {
      setIsRestoring(false)
    }
  }

  const handleClearArchive = async (event) => {
    event.preventDefault()

    try {
      setIsClearing(true)
      setError('')
      setSuccessMessage('')

      await api.post('/archive/clear-all', {
        authorizationPassword: clearPassword,
      })

      setSuccessMessage('Archive cleared successfully.')
      setClearPassword('')
      setIsClearModalOpen(false)
      await loadArchiveEntries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear archive')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Archive</h1>
        <p>Review deleted users and branches. Only super admins can restore or clear.</p>
      </header>

      {error ? <p className="status-warning">{error}</p> : null}
      {successMessage ? <p className="status-positive">{successMessage}</p> : null}

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Archived Records</h3>
          <div className="action-row">
            <Button
              onClick={() => {
                setSelectedEntryId(entries[0]?._id || '')
                setRestorePassword('')
                setIsRestoreModalOpen(true)
              }}
              disabled={!entries.length}
            >
              Retrieve Record
            </Button>
            <Button variant="danger" onClick={() => {
              setClearPassword('')
              setIsClearModalOpen(true)
            }}>
              Clear Archive
            </Button>
          </div>
        </div>

        {loading ? <p style={{ padding: '1rem' }}>Loading archive...</p> : null}
        {!loading && !error && <Table columns={archiveColumns} rows={rows} />}
      </section>

      <Modal title="Restore Record" isOpen={isRestoreModalOpen} onClose={() => setIsRestoreModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleRestore}>
          <div className="form-group">
            <label htmlFor="selectedEntry">Record to Restore</label>
            <select
              id="selectedEntry"
              value={selectedEntryId}
              onChange={(event) => setSelectedEntryId(event.target.value)}
              required
            >
              {entries.map((entry) => (
                <option key={entry._id} value={entry._id}>
                  {entry.entityType === 'branch' ? 'Branch' : 'User'}: {entry.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="restorePassword">Admin Password</label>
            <input
              id="restorePassword"
              type="password"
              value={restorePassword}
              onChange={(event) => setRestorePassword(event.target.value)}
              required
            />
          </div>

          <div className="modal-form-actions">
            <Button variant="outline" onClick={() => setIsRestoreModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isRestoring}>
              {isRestoring ? 'Restoring...' : 'Restore Record'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal title="Clear Archive" isOpen={isClearModalOpen} onClose={() => setIsClearModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleClearArchive}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to permanently delete all archived records? This action cannot be undone.
          </p>

          <div className="form-group">
            <label htmlFor="clearPassword">Admin Password</label>
            <input
              id="clearPassword"
              type="password"
              value={clearPassword}
              onChange={(event) => setClearPassword(event.target.value)}
              required
            />
          </div>

          <div className="modal-form-actions">
            <Button variant="outline" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={isClearing}>
              {isClearing ? 'Clearing...' : 'Clear Archive'}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default ArchivePage