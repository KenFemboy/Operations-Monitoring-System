import Employee from "../../models/Employee.js";
import Feedback from "../../models/Feedback.js";
import Product from "../../models/Product.js";
import Purchase from "../../models/Purchase.js";
import Sale from "../../models/Sale.js";
import StockIn from "../../models/StockIn.js";
import StockOut from "../../models/StockOut.js";
import { getUserBranchId, isSuperAdmin } from "../../middleware/accessControl.js";

const archiveActorFields = [
  { path: "archivedBy", select: "name email" },
  { path: "restoredBy", select: "name email" },
  { path: "branch", select: "branchName location address" },
];

const withInventoryPopulates = [
  ...archiveActorFields,
  { path: "product", select: "productId name category unit branch" },
];

const archiveConfigs = {
  employees: {
    Model: Employee,
    label: "Employee",
    populate: archiveActorFields,
  },
  sales: {
    Model: Sale,
    label: "Sale",
    populate: archiveActorFields,
  },
  feedback: {
    Model: Feedback,
    label: "Feedback",
    populate: archiveActorFields,
  },
  products: {
    Model: Product,
    label: "Product",
    populate: archiveActorFields,
  },
  purchases: {
    Model: Purchase,
    label: "Purchase",
    populate: withInventoryPopulates,
  },
  stockIns: {
    Model: StockIn,
    label: "Stock in record",
    populate: withInventoryPopulates,
  },
  stockOuts: {
    Model: StockOut,
    label: "Stock out record",
    populate: withInventoryPopulates,
  },
};

const getActorId = (req) => req.user?._id || req.user?.id || null;

const populateArchiveRecord = (query, populate = []) =>
  populate.reduce((currentQuery, populateConfig) => {
    return currentQuery.populate(populateConfig);
  }, query);

const assertArchiveAccess = (req, record) => {
  if (isSuperAdmin(req.user)) {
    return;
  }

  const userBranchId = getUserBranchId(req.user);

  if (!userBranchId || String(record.branch) !== userBranchId) {
    const error = new Error("Forbidden: you can only archive records from your assigned branch");
    error.statusCode = 403;
    throw error;
  }
};

export const archiveRecord = (configKey) => async (req, res) => {
  const config = archiveConfigs[configKey];

  try {
    const record = await config.Model.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `${config.label} not found`,
      });
    }

    assertArchiveAccess(req, record);

    record.isArchived = true;
    record.archivedAt = new Date();
    record.archivedBy = getActorId(req);
    record.archiveReason = req.body?.reason || "No reason provided";
    await record.save();

    const archivedRecord = await populateArchiveRecord(
      config.Model.findById(record._id),
      config.populate
    );

    return res.status(200).json({
      success: true,
      message: `${config.label} archived successfully`,
      data: archivedRecord,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: `Failed to archive ${config.label.toLowerCase()}`,
      error: error.message,
    });
  }
};

export const restoreRecord = (configKey) => async (req, res) => {
  const config = archiveConfigs[configKey];

  try {
    const record = await config.Model.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `${config.label} not found`,
      });
    }

    record.isArchived = false;
    record.restoredAt = new Date();
    record.restoredBy = getActorId(req);
    await record.save();

    const restoredRecord = await populateArchiveRecord(
      config.Model.findById(record._id),
      config.populate
    );

    return res.status(200).json({
      success: true,
      message: `${config.label} restored successfully`,
      data: restoredRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to restore ${config.label.toLowerCase()}`,
      error: error.message,
    });
  }
};

export const getArchivedRecords = (configKey) => async (_req, res) => {
  const config = archiveConfigs[configKey];

  try {
    const query = config.Model.find({ isArchived: true }).sort({
      archivedAt: -1,
      createdAt: -1,
    });
    const records = await populateArchiveRecord(query, config.populate);

    return res.status(200).json({
      success: true,
      message: `Archived ${config.label.toLowerCase()} records fetched successfully`,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to fetch archived ${config.label.toLowerCase()} records`,
      error: error.message,
    });
  }
};

export const archiveEmployee = archiveRecord("employees");
export const restoreEmployee = restoreRecord("employees");
export const getArchivedEmployees = getArchivedRecords("employees");

export const archiveSale = archiveRecord("sales");
export const restoreSale = restoreRecord("sales");
export const getArchivedSales = getArchivedRecords("sales");

export const archiveFeedback = archiveRecord("feedback");
export const restoreFeedback = restoreRecord("feedback");
export const getArchivedFeedback = getArchivedRecords("feedback");

export const archiveProduct = archiveRecord("products");
export const restoreProduct = restoreRecord("products");
export const getArchivedProducts = getArchivedRecords("products");

export const archivePurchase = archiveRecord("purchases");
export const restorePurchase = restoreRecord("purchases");
export const getArchivedPurchases = getArchivedRecords("purchases");

export const archiveStockIn = archiveRecord("stockIns");
export const restoreStockIn = restoreRecord("stockIns");
export const getArchivedStockIns = getArchivedRecords("stockIns");

export const archiveStockOut = archiveRecord("stockOuts");
export const restoreStockOut = restoreRecord("stockOuts");
export const getArchivedStockOuts = getArchivedRecords("stockOuts");
