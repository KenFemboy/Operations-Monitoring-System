import Plantilla from "../models/Plantilla.js";
const getPlantillaStatus = (requiredCount, currentCount) => {
  const required = Number(requiredCount || 0);
  const current = Number(currentCount || 0);

  if (current === 0) return "open";
  if (current < required) return "understaffed";
  if (current === required) return "filled";
  if (current > required) return "overstaffed";

  return "open";
};

export const createPlantilla = async (req, res) => {
  try {
    const { position, branch, requiredCount, currentCount } = req.body;

    const plantilla = await Plantilla.create({
      position,
      branch,
      requiredCount: Number(requiredCount || 0),
      currentCount: Number(currentCount || 0),
      status: getPlantillaStatus(requiredCount, currentCount),
    });

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

export const getPlantillaById = async (req, res) => {
  try {
    const plantilla = await Plantilla.findById(req.params.id);

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch plantilla",
      error: error.message,
    });
  }
};

export const updatePlantilla = async (req, res) => {
  try {
    const { position, branch, requiredCount, currentCount } = req.body;

    const plantilla = await Plantilla.findByIdAndUpdate(
      req.params.id,
      {
        position,
        branch,
        requiredCount: Number(requiredCount || 0),
        currentCount: Number(currentCount || 0),
        status: getPlantillaStatus(requiredCount, currentCount),
      },
      { new: true, runValidators: true }
    );

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plantilla updated successfully",
      data: plantilla,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update plantilla",
      error: error.message,
    });
  }
};
export const deletePlantilla = async (req, res) => {
  try {
    const plantilla = await Plantilla.findByIdAndDelete(req.params.id);

    if (!plantilla) {
      return res.status(404).json({
        success: false,
        message: "Plantilla not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plantilla deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete plantilla",
      error: error.message,
    });
  }
};