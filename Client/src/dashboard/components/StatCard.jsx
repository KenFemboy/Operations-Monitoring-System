function StatCard({ title, value, subtitle, tone = "blue" }) {
  const colorMap = {
    blue: {
      bg: "#eff6ff",
      border: "#bfdbfe",
      text: "#1d4ed8",
    },
    green: {
      bg: "#ecfdf5",
      border: "#bbf7d0",
      text: "#15803d",
    },
    yellow: {
      bg: "#fefce8",
      border: "#fde68a",
      text: "#a16207",
    },
    red: {
      bg: "#fef2f2",
      border: "#fecaca",
      text: "#b91c1c",
    },
    purple: {
      bg: "#faf5ff",
      border: "#e9d5ff",
      text: "#7e22ce",
    },
    gray: {
      bg: "#f9fafb",
      border: "#e5e7eb",
      text: "#374151",
    },
  };

  const color = colorMap[tone] || colorMap.blue;

  return (
    <div
      style={{
        backgroundColor: color.bg,
        border: `1px solid ${color.border}`,
        borderRadius: "14px",
        padding: "16px",
        minHeight: "96px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "8px 0",
          color: color.text,
          fontSize: "26px",
          lineHeight: 1.15,
        }}
      >
        {value}
      </h2>

      {subtitle && (
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default StatCard;