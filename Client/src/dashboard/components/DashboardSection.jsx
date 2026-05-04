function DashboardSection({ title, children }) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "16px",
          color: "#111827",
          fontSize: "20px",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

export default DashboardSection;