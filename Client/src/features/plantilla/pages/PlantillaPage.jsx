import { useState } from 'react'
import Table from '../../shared/components/Table'
import { useBranchContext } from '../../shared/store/branchContext'
import usePlantilla from '../hooks/usePlantilla'
import { plantillaColumns } from '../utils/plantillaColumns'

import PlantillaCard from '../components/PlantillaCard'
import PlantillaForm from '../components/PlantillaForm'

function PlantillaPage() {
  const { rows = [], createPlantilla, updatePlantilla, deletePlantilla } = usePlantilla()
  const { activeBranch, isReadOnly, branches } = useBranchContext()

  const [showForm, setShowForm] = useState(false)
  const [selectedPlantilla, setSelectedPlantilla] = useState(null)

  // --- Handlers ---
  const handleCreate = () => {
    setSelectedPlantilla(null)
    setShowForm(true)
  }

  const handleEdit = (plantilla) => {
    setSelectedPlantilla(plantilla)
    setShowForm(true)
  }

  const handleDelete = (plantilla) => {
    if (confirm(`Delete ${plantilla.role}?`)) {
      deletePlantilla(plantilla._id)
    }
  }

  const handleSubmit = (data) => {
    const selectedBranch = branches.find((branch) => branch.id === Number(data.branchId))

    if (selectedPlantilla) {
      updatePlantilla(selectedPlantilla._id, {
        ...data,
        branch: selectedBranch?.name || activeBranch,
      })
    } else {
      createPlantilla({
        ...data,
        branch: selectedBranch?.name || activeBranch,
      })
    }
    setShowForm(false)
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
            />

            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* --- CARD VIEW --- */}
      <section className="card-grid">
        {rows.map((plantilla) => (
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

        <Table columns={plantillaColumns} rows={rows} />
      </section>
    </section>
  )
}

export default PlantillaPage