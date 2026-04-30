import { useEffect, useState } from "react";
import { getPlantillas, createPlantilla } from "../api/plantillaApi";

function PlantillaPage() {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    position: "",
    branch: "",
    requiredCount: "",
    currentCount: "",
    status: "open",
  });

  const fetchPlantillas = async () => {
    try {
      setLoading(true);
      const res = await getPlantillas();
      setPlantillas(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch plantilla records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantillas();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getStatus = (required, current) => {
    const req = Number(required);
    const cur = Number(current);

    if (cur === 0) return "open";
    if (cur < req) return "understaffed";
    if (cur === req) return "filled";
    if (cur > req) return "overstaffed";

    return "open";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const status = getStatus(form.requiredCount, form.currentCount);

    const payload = {
      position: form.position,
      branch: form.branch,
      requiredCount: Number(form.requiredCount),
      currentCount: Number(form.currentCount),
      status,
    };

    try {
      await createPlantilla(payload);
      alert("Plantilla added successfully");

      setForm({
        position: "",
        branch: "",
        requiredCount: "",
        currentCount: "",
        status: "open",
      });
      

      fetchPlantillas();
    } catch (error) {
      console.error(error);
      alert("Failed to create plantilla");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Plantilla Management</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <h2>Add Plantilla</h2>

        <input
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
        />

        <input
          name="branch"
          placeholder="Branch"
          value={form.branch}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="requiredCount"
          placeholder="Required Staff Count"
          value={form.requiredCount}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="currentCount"
          placeholder="Current Staff Count"
          value={form.currentCount}
          onChange={handleChange}
          required
        />

        <button type="submit">Save Plantilla</button>
      </form>

      <h2>Plantilla List</h2>

      {loading ? (
        <p>Loading plantilla...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Branch</th>
              <th>Required Count</th>
              <th>Current Count</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {plantillas.length === 0 ? (
              <tr>
                <td colSpan="5" align="center">
                  No plantilla records found
                </td>
              </tr>
            ) : (
              plantillas.map((item) => (
                <tr key={item._id}>
                  <td>{item.position}</td>
                  <td>{item.branch}</td>
                  <td>{item.requiredCount}</td>
                  <td>{item.currentCount}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlantillaPage;