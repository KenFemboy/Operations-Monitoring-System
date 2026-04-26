function Card({ title, value, children }) {
  return (
    <section className="card">
      {title ? <h3>{title}</h3> : null}
      {value ? <p className="value">{value}</p> : null}
      {children}
    </section>
  )
}

export default Card
