import Plantilla from "../models/Plantilla.js";
// ================= PLANTILLA =================

export const createPlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.create(req.body);

    res.status(201).json({
      success: true,
      message: "Plantilla created successfully",
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create plantilla",
      error: error.message,
    });
  }
};

export const getPlantillas = async (req, res) => {
  try {
    const plantillas = await Plantilla.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: plantillas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plantillas",
      error: error.message,
    });
  }
};