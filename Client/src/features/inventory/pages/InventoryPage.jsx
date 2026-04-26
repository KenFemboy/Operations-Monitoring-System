import { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import InventoryForm from '../components/InventoryForm'
import useInventory from '../hooks/useInventory'
import { inventoryColumns } from '../utils/inventoryColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const rows = useInventory()
  const { activeBranch, displayBranchName, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Inventory</h1>
        <p>Track ingredient and supply levels for {displayBranchName || activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Inventory Items</h3>
          <Button onClick={() => setIsOpen(true)} disabled={isReadOnly}>Add Item</Button>
        </div>
        <Table
          columns={inventoryColumns}
          rows={rows}
          renderActions={() => (
            <div className="action-row">
              <Button variant="outline" disabled={isReadOnly}>Edit</Button>
              <Button variant="danger" disabled={isReadOnly}>Delete</Button>
            </div>
          )}
        />
      </section>
      <Modal title="Add Inventory Item" isOpen={isOpen && !isReadOnly} onClose={() => setIsOpen(false)}>
        <InventoryForm onClose={() => setIsOpen(false)} />
      </Modal>
    </section>
  )
}

export default InventoryPage
