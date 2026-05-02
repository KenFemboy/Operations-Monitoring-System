import { useEffect, useState } from "react";

import {
  getPlantillas,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
} from "../api/plantillaApi";

import PlantillaForm from "../components/PlantillaForm";
import PlantillaTable from "../components/PlantillaTable";

function PlantillaPage() {
  const [plantillas, setPlantillas] = useState([]);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmitPlantilla = async (data) => {
    try {
      if (selectedPlantilla) {
        await updatePlantilla(selectedPlantilla._id, data);
        alert("Plantilla updated successfully");
      } else {
        await createPlantilla(data);
        alert("Plantilla created successfully");
      }

      setSelectedPlantilla(null);
      fetchPlantillas();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save plantilla");
    }
  };

const handleEditPlantilla = (plantilla) => {
  setSelectedPlantilla(plantilla);
};

  const handleDeletePlantilla = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this plantilla?"
    );

    if (!confirmDelete) return;

    try {
      await deletePlantilla(id);
      alert("Plantilla deleted successfully");
      fetchPlantillas();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete plantilla");
    }
  };

  return (
    <div style={styles.page}>
      <h1>Plantilla Management</h1>
      <p>Manage staffing requirements per position and branch.</p>

      <PlantillaForm
        selectedPlantilla={selectedPlantilla}
        onSubmit={handleSubmitPlantilla}
        onCancelEdit={() => setSelectedPlantilla(null)}
      />

      {loading ? (
        <p>Loading plantilla records...</p>
      ) : (
        <PlantillaTable
          plantillas={plantillas}
          onEdit={handleEditPlantilla}
          onDelete={handleDeletePlantilla}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
};

export default PlantillaPage;