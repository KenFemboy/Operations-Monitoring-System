function Button({ children, variant = 'primary', type = 'button', onClick, disabled = false }) {
  const className = `btn btn-${variant}`

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button