import * as plantillaService from "../modules/plantilla/plantilla.service.js";
import * as plantillaValidator from "../modules/plantilla/plantilla.validator.js";

export const createPlantilla = async (req, res) => {
  try {
    const validation = plantillaValidator.validateCreatePlantilla(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.errors,
      });
    }

    const plantilla = await plantillaService.createPlantilla(req.body);

    res.status(201).json({
      success: true,
      message: "Plantilla created successfully",
      data: plantilla,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error creating plantilla",
    });
  }
};

export const getAllPlantilla = async (req, res) => {
  try {
    const plantillas = await plantillaService.getAllPlantilla();

    res.status(200).json({
      success: true,
      count: plantillas.length,
      data: plantillas,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching plantilla",
    });
  }
};

export const getPlantillaById = async (req, res) => {
  try {
    const plantilla = await plantillaService.getPlantillaById(req.params.id);

    res.status(200).json({
      success: true,
      data: plantilla,
    });
  } catch (err) {
    res.status(err.message.includes("Invalid") ? 400 : 404).json({
      success: false,
      message: err.message || "Error fetching plantilla",
    });
  }
};

export const getPlantillaByBranch = async (req, res) => {
  try {
    const plantillas = await plantillaService.getPlantillaByBranch(
      req.params.branchId
    );

    res.status(200).json({
      success: true,
      count: plantillas.length,
      data: plantillas,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Error fetching plantilla by branch",
    });
  }
};

export const updatePlantilla = async (req, res) => {
  try {
    const validation = plantillaValidator.validateUpdatePlantilla(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validation.errors,
      });
    }

    const plantilla = await plantillaService.updatePlantilla(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Plantilla updated successfully",
      data: plantilla,
    });
  } catch (err) {
    res.status(err.message.includes("Invalid") ? 400 : 404).json({
      success: false,
      message: err.message || "Error updating plantilla",
    });
  }
};

export const deletePlantilla = async (req, res) => {
  try {
    const plantilla = await plantillaService.deletePlantilla(req.params.id);

    res.status(200).json({
      success: true,
      message: "Plantilla deleted successfully",
      data: plantilla,
    });
  } catch (err) {
    res.status(err.message.includes("Invalid") ? 400 : 404).json({
      success: false,
      message: err.message || "Error deleting plantilla",
    });
  }
};

export const getPlantillaStats = async (req, res) => {
  try {
    const stats = await plantillaService.getPlantillaStats(req.params.branchId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Error fetching plantilla stats",
    });
  }
};

export const updateFilledCount = async (req, res) => {
  try {
    const { count } = req.body;

    if (count === undefined) {
      return res.status(400).json({
        success: false,
        message: "Filled count is required",
      });
    }

    const plantilla = await plantillaService.updateFilledCount(
      req.params.id,
      count
    );

    res.status(200).json({
      success: true,
      message: "Filled count updated successfully",
      data: plantilla,
    });
  } catch (err) {
    res.status(err.message.includes("Invalid") ? 400 : 404).json({
      success: false,
      message: err.message || "Error updating filled count",
    });
  }
};

export const calculateTotalCost = async (req, res) => {
  try {
    const costs = await plantillaService.calculateTotalCost(req.params.branchId);

    res.status(200).json({
      success: true,
      data: costs,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Error calculating total cost",
    });
  }
};
