import React from "react";

const AttendanceSummaryCards = ({ data }) => {
  const present = data.filter(d => d.status === "present").length;
  const late = data.filter(d => d.status === "late").length;
  const absent = data.filter(d => d.status === "absent").length;
  const leave = data.filter(d => d.status === "leave").length;

  const cards = [
    { label: "Present", value: present, tone: "present" },
    { label: "Late", value: late, tone: "late" },
    { label: "Absent", value: absent, tone: "absent" },
    { label: "On Leave", value: leave, tone: "leave" },
  ];

  return (
    <section className="attendance-summary-grid" aria-label="Attendance summary">
      {cards.map((card) => (
        <article className={`attendance-summary-card ${card.tone}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
};

export default AttendanceSummaryCards;
