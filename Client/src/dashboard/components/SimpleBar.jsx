function SimpleBar({ label, value, max, color = "#2563eb" }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "14px",
        }}
      >
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default SimpleBar;