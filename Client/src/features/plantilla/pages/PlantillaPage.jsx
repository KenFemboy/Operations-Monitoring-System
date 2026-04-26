import { useState } from 'react'
import Table from '../../shared/components/Table'
import { useBranchContext } from '../../shared/store/branchContext'
import usePlantilla from '../hooks/usePlantilla'
import { plantillaColumns } from '../utils/plantillaColumns'

import PlantillaCard from '../components/PlantillaCard'
import PlantillaForm from '../components/PlantillaForm'

function PlantillaPage() {
  const {
    rows = [],
    branches = [],
    isLoading,
    error,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  } = usePlantilla()
  const { activeBranch, isReadOnly } = useBranchContext()

  const [showForm, setShowForm] = useState(false)
  const [selectedPlantilla, setSelectedPlantilla] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // --- Handlers ---
  const handleCreate = () => {
    setSelectedPlantilla(null)
    setShowForm(true)
  }

  const handleEdit = (plantilla) => {
    setSelectedPlantilla(plantilla)
    setShowForm(true)
  }

  const handleDelete = async (plantilla) => {
    if (confirm(`Delete ${plantilla.role}?`)) {
      await deletePlantilla(plantilla._id)
    }
  }

  const handleSubmit = async (data) => {
    try {
      setIsSaving(true)
      setFormError('')

      if (selectedPlantilla) {
        await updatePlantilla(selectedPlantilla._id, data)
      } else {
        await createPlantilla(data)
      }

      setShowForm(false)
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save plantilla')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Plantilla</h1>
        <p>Employee positions and salary structure for {activeBranch}</p>

        {!isReadOnly && (
          <button onClick={handleCreate} className="primary-btn">
            + Add Role
          </button>
        )}

        {isReadOnly && <p className="readonly-label">View Only Mode</p>}
      </header>

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedPlantilla ? 'Edit Role' : 'Add Role'}</h3>

            <PlantillaForm
              onSubmit={handleSubmit}
              initialData={selectedPlantilla}
              branches={branches}
              isLoading={isSaving}
            />

            {formError ? <p style={{ color: 'red' }}>{formError}</p> : null}
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <p>Loading plantilla records...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}

      {/* --- CARD VIEW --- */}
      <section className="card-grid">
        {!isLoading && rows.map((plantilla) => (
          <PlantillaCard
            key={plantilla._id}
            plantilla={plantilla}
            onEdit={!isReadOnly ? () => handleEdit(plantilla) : null}
            onDelete={!isReadOnly ? () => handleDelete(plantilla) : null}
            onViewDetails={() => console.log('View details', plantilla)}
          />
        ))}
      </section>

      {/* --- TABLE VIEW --- */}
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Role and Salary Structure</h3>
        </div>

        <Table columns={plantillaColumns} rows={isLoading ? [] : rows} />
      </section>
    </section>
  )
}

export default PlantillaPage
