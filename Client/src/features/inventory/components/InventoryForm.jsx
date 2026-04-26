import Button from '../../shared/components/Button'

function InventoryForm({ onClose }) {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="itemName">Item Name</label>
        <input id="itemName" placeholder="Sample ingredient" />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input id="category" placeholder="Meat / Vegetables / Drinks" />
      </div>
      <div className="form-group">
        <label htmlFor="stockQuantity">Stock Quantity</label>
        <input id="stockQuantity" placeholder="0" />
      </div>
      <Button onClick={onClose}>Save Item</Button>
    </form>
  )
}

export default InventoryForm
