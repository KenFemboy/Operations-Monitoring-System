import { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import InventoryForm from '../components/InventoryForm'
import useInventory from '../hooks/useInventory'
import { inventoryColumns } from '../utils/inventoryColumns'

function InventoryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const rows = useInventory()

  return (
    <section>
      <header className="page-header">
        <h1>Inventory</h1>
        <p>Track ingredient and supply levels</p>
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Inventory Items</h3>
          <Button onClick={() => setIsOpen(true)}>Add Item</Button>
        </div>
        <Table columns={inventoryColumns} rows={rows} />
      </section>
      <Modal title="Add Inventory Item" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <InventoryForm onClose={() => setIsOpen(false)} />
      </Modal>
    </section>
  )
}

export default InventoryPage
