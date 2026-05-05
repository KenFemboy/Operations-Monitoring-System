function DashboardSection({ title, children }) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "22px",
        marginBottom: "20px",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "14px",
          color: "#111827",
          fontSize: "20px",
          lineHeight: 1.35,
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

export default DashboardSection;