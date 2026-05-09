function Modal({ title, children, isOpen, onClose }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-body">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div>{children}</div>
      </section>
    </div>
  )
}

export default Modal
