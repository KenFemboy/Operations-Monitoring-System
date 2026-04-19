function Button({ children, variant = 'primary', type = 'button', onClick }) {
  const className = `btn btn-${variant}`

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button