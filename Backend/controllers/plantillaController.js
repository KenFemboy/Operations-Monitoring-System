import * as plantillaService from "../modules/plantilla/plantilla.service.js";
import { canAccessBranch } from "../middleware/plantillaBranchAccess.js";

const sendError = (res, error) => {
  const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Plantilla request failed",
  });
};

const assertCanAccessPlantillaBranch = (req, plantilla) => {
  if (!canAccessBranch(req.user, plantilla.branchId?._id || plantilla.branchId)) {
    const error = new Error("Forbidden: you can only manage your assigned branch");
    error.statusCode = 403;
    throw error;
  }
};

export const createPlantilla = async (req, res) => {
  try {
    const plantilla = await plantillaService.createPlantilla(req.body);

    return res.status(201).json({
      success: true,
      message: "Plantilla created successfully",
      data: plantilla,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getPlantillasByBranch = async (req, res) => {
  try {
    const plantillas = await plantillaService.getPlantillasByBranch(req.params.branchId);

    return res.status(200).json({
      success: true,
      count: plantillas.length,
      data: plantillas,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const updatePlantilla = async (req, res) => {
  try {
    const currentPlantilla = await plantillaService.getPlantillaById(req.params.id);
    assertCanAccessPlantillaBranch(req, currentPlantilla);

    if (req.body.branchId && !canAccessBranch(req.user, req.body.branchId)) {
      const error = new Error("Forbidden: you can only move plantilla within your assigned branch");
      error.statusCode = 403;
      throw error;
    }

    const plantilla = await plantillaService.updatePlantilla(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Plantilla updated successfully",
      data: plantilla,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deletePlantilla = async (req, res) => {
  try {
    const currentPlantilla = await plantillaService.getPlantillaById(req.params.id);
    assertCanAccessPlantillaBranch(req, currentPlantilla);

    const plantilla = await plantillaService.deletePlantilla(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Plantilla deleted successfully",
      data: plantilla,
    });
  } catch (error) {
    return sendError(res, error);
  }
};
