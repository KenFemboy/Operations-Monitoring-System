import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  );
}
