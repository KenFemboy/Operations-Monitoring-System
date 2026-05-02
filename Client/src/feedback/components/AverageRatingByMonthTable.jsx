function AverageRatingByMonthTable({ data }) {
  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  return (
    <div style={styles.card}>
      <h2>Average Rating By Month</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Month</th>
            <th style={styles.th}>Average Rating</th>
            <th style={styles.th}>Stars</th>
            <th style={styles.th}>Total Reviews</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td style={styles.empty} colSpan="4">
                No monthly rating data found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={`${item.year}-${item.month}`}>
                <td style={styles.td}>
                  {monthNames[item.month]} {item.year}
                </td>

                <td style={styles.td}>
                  <strong>{item.averageRating}</strong> / 5
                </td>

                <td style={styles.td}>
                  <span style={styles.starText}>
                    {renderStars(item.averageRating)}
                  </span>
                </td>

                <td style={styles.td}>{item.totalReviews}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f9fafb",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "12px",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  starText: {
    color: "#f59e0b",
    fontSize: "18px",
    letterSpacing: "2px",
  },
};

export default AverageRatingByMonthTable;