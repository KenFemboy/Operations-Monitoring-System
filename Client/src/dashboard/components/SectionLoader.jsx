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
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
  },

  title: {
    marginTop: 0,
    marginBottom: "10px",
    color: "#111827",
    fontSize: "20px",
    lineHeight: 1.35,
  },

  text: {
    color: "#4b5563",
    fontSize: "14px",
  },
};

export default SectionLoader;