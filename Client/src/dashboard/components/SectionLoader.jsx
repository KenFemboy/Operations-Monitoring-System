function SectionLoader({ title }) {
  return (
    <section style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.text}>Loading...</p>
    </section>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  title: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#111827",
    fontSize: "20px",
  },

  text: {
    color: "#6b7280",
  },
};

export default SectionLoader;