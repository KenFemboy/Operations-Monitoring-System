import Product from "../../models/Product.js";
import Purchase from "../../models/Purchase.js";
import StockIn from "../../models/StockIn.js";
import StockOut from "../../models/StockOut.js";
import {
  assertCanAccessBranch,
  getUserBranchId,
  isSuperAdmin,
} from "../../utils/branchAccess.js";
import { getBranchFilter } from "../../utils/branchFilter.js";

const getInventoryBranchFilter = (req) => {
  if (isSuperAdmin(req.user) && req.query?.branchId) {
    return { branch: req.query.branchId };
  }

  return getBranchFilter(req);
};

const updateProductStatus = (product) => {
  if (product.currentStock === 0) {
    product.status = "Out of Stock";
  } else if (product.currentStock <= product.minimumStock) {
    product.status = "Low Stock";
  } else {
    product.status = "Available";
  }
};

const parseMinimumStock = (value) => {
  if (value === undefined || value === null || value === "") {
    return { isProvided: false, value: 0 };
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return {
      isProvided: true,
      error: "Minimum stock must be zero or greater",
    };
  }

  return { isProvided: true, value: numericValue };
};

const parseMovementQuantity = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return {
      error: "Quantity must be greater than zero",
    };
  }

  return { value: numericValue };
};

// =======================
// PRODUCT CONTROLLERS
// =======================

export const createProduct = async (req, res) => {
  try {
    const { name, category, unit, minimumStock } = req.body;
    const parsedMinimumStock = parseMinimumStock(minimumStock);

    if (parsedMinimumStock.error) {
      return res.status(400).json({
        success: false,
        message: parsedMinimumStock.error,
      });
    }

    const branch = isSuperAdmin(req.user)
      ? req.body.branch || req.body.branchId
      : getUserBranchId(req.user);

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch is required",
      });
    }

    const product = await Product.create({
      name,
      category,
      unit,
      minimumStock: parsedMinimumStock.value,
      currentStock: 0,
      branch,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const filter = { ...getInventoryBranchFilter(req), isArchived: { $ne: true } };
    const products = await Product.find(filter)
      .populate("branch", "branchName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    const stockIns = await StockIn.find({ product: req.params.id, isArchived: { $ne: true } })
      .populate("product")
      .sort({ createdAt: -1 });

    const stockOuts = await StockOut.find({ product: req.params.id, isArchived: { $ne: true } })
      .populate("product")
      .sort({ createdAt: -1 });

    const purchases = await Purchase.find({ product: req.params.id, isArchived: { $ne: true } })
      .populate("product")
      .sort({ createdAt: -1 });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    assertCanAccessBranch(req, product.branch);

    res.status(200).json({
      success: true,
      data: {
        product,
        stockIns,
        stockOuts,
        purchases,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, category, unit, minimumStock } = req.body;
    const parsedMinimumStock = parseMinimumStock(minimumStock);

    if (parsedMinimumStock.error) {
      return res.status(400).json({
        success: false,
        message: parsedMinimumStock.error,
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    assertCanAccessBranch(req, product.branch);

    product.name = name || product.name;
    product.category = category || product.category;
    product.unit = unit || product.unit;
    product.minimumStock = parsedMinimumStock.isProvided
      ? parsedMinimumStock.value
      : product.minimumStock;

    updateProductStatus(product);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    assertCanAccessBranch(req, product.branch);

    product.isArchived = true;
    product.archivedAt = new Date();
    product.archivedBy = req.user?._id || req.user?.id || null;
    product.archiveReason = req.body?.reason || "No reason provided";
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product archived successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to archive product",
      error: error.message,
    });
  }
};

// =======================
// PURCHASE CONTROLLERS
// =======================

export const createPurchase = async (req, res) => {
  try {
    const {
      product,
      supplierName,
      quantity,
      unitCost,
      purchaseDate,
      remarks,
    } = req.body;

    const existingProduct = await Product.findOne({
      _id: product,
      isArchived: { $ne: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const branch = isSuperAdmin(req.user)
      ? req.body.branch || req.body.branchId || existingProduct.branch
      : getUserBranchId(req.user);

    assertCanAccessBranch(req, existingProduct.branch);

    const purchase = await Purchase.create({
      product,
      supplierName,
      quantity,
      unitCost,
      purchaseDate,
      remarks,
      branch,
    });

    const populatedPurchase = await Purchase.findById(purchase._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: populatedPurchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create purchase",
      error: error.message,
    });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const filter = { ...getInventoryBranchFilter(req), isArchived: { $ne: true } };
    const purchases = await Purchase.find(filter)
      .populate("product")
      .populate("branch", "branchName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchases",
      error: error.message,
    });
  }
};

export const markPurchaseAsReceived = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    if (purchase.status === "Received") {
      return res.status(400).json({
        success: false,
        message: "Purchase is already received",
      });
    }

    if (purchase.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled purchase cannot be received",
      });
    }

    const product = await Product.findOne({
      _id: purchase.product,
      isArchived: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    assertCanAccessBranch(req, purchase.branch);

    product.currentStock += purchase.quantity;
    updateProductStatus(product);
    await product.save();

    purchase.status = "Received";
    await purchase.save();

    await StockIn.create({
      product: purchase.product,
      quantity: purchase.quantity,
      reason: "Purchase",
      referencePurchase: purchase._id,
      remarks: "Stock added from received purchase",
      branch: purchase.branch,
    });

    res.status(200).json({
      success: true,
      message: "Purchase received and stock added",
      data: { purchase, product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to receive purchase",
      error: error.message,
    });
  }
};

export const cancelPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      _id: req.params.id,
      isArchived: { $ne: true },
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    if (purchase.status === "Received") {
      return res.status(400).json({
        success: false,
        message: "Received purchase cannot be cancelled",
      });
    }

    assertCanAccessBranch(req, purchase.branch);

    purchase.status = "Cancelled";
    await purchase.save();

    res.status(200).json({
      success: true,
      message: "Purchase cancelled successfully",
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel purchase",
      error: error.message,
    });
  }
};

// =======================
// STOCK IN CONTROLLERS
// =======================

export const createStockIn = async (req, res) => {
  try {
    const { product, quantity, reason, remarks } = req.body;
    const parsedQuantity = parseMovementQuantity(quantity);

    if (parsedQuantity.error) {
      return res.status(400).json({
        success: false,
        message: parsedQuantity.error,
      });
    }

    const existingProduct = await Product.findOne({
      _id: product,
      isArchived: { $ne: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const branch = isSuperAdmin(req.user)
      ? req.body.branch || req.body.branchId || existingProduct.branch
      : getUserBranchId(req.user);

    assertCanAccessBranch(req, existingProduct.branch);

    existingProduct.currentStock += parsedQuantity.value;
    updateProductStatus(existingProduct);
    await existingProduct.save();

    const stockIn = await StockIn.create({
      product,
      quantity: parsedQuantity.value,
      reason,
      remarks,
      branch,
    });

    const populatedStockIn = await StockIn.findById(stockIn._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: { stockIn: populatedStockIn, product: existingProduct },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to stock in",
      error: error.message,
    });
  }
};

export const getStockIns = async (req, res) => {
  try {
    const filter = { ...getInventoryBranchFilter(req), isArchived: { $ne: true } };
    const stockIns = await StockIn.find(filter)
      .populate("product")
      .populate("branch", "branchName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stockIns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock in records",
      error: error.message,
    });
  }
};

// =======================
// STOCK OUT CONTROLLERS
// =======================

export const createStockOut = async (req, res) => {
  try {
    const { product, quantity, reason, remarks } = req.body;
    const parsedQuantity = parseMovementQuantity(quantity);

    if (parsedQuantity.error) {
      return res.status(400).json({
        success: false,
        message: parsedQuantity.error,
      });
    }

    const existingProduct = await Product.findOne({
      _id: product,
      isArchived: { $ne: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (parsedQuantity.value > existingProduct.currentStock) {
      return res.status(400).json({
        success: false,
        message: "Cannot stock out. Not enough stock available.",
      });
    }

    const branch = isSuperAdmin(req.user)
      ? req.body.branch || req.body.branchId || existingProduct.branch
      : getUserBranchId(req.user);

    assertCanAccessBranch(req, existingProduct.branch);

    existingProduct.currentStock -= parsedQuantity.value;
    updateProductStatus(existingProduct);
    await existingProduct.save();

    const stockOut = await StockOut.create({
      product,
      quantity: parsedQuantity.value,
      reason,
      remarks,
      branch,
    });

    const populatedStockOut = await StockOut.findById(stockOut._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Stock deducted successfully",
      data: { stockOut: populatedStockOut, product: existingProduct },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to stock out",
      error: error.message,
    });
  }
};

export const getStockOuts = async (req, res) => {
  try {
    const filter = { ...getInventoryBranchFilter(req), isArchived: { $ne: true } };
    const stockOuts = await StockOut.find(filter)
      .populate("product")
      .populate("branch", "branchName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stockOuts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock out records",
      error: error.message,
    });
  }
};
export const getInventoryRecords = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let stockIns = [];
    let stockOuts = [];

    const branchFilter = getInventoryBranchFilter(req);
    const combinedFilter = { ...dateFilter, ...branchFilter, isArchived: { $ne: true } };

    if (!type || type === "all" || type === "stock-in") {
      stockIns = await StockIn.find(combinedFilter)
        .populate("product")
        .sort({ createdAt: -1 });
    }

    if (!type || type === "all" || type === "stock-out") {
      stockOuts = await StockOut.find(combinedFilter)
        .populate("product")
        .sort({ createdAt: -1 });
    }

    const records = [
      ...stockIns.map((record) => ({
        _id: record._id,
        recordId: record.stockInId,
        type: "Stock In",
        product: record.product,
        quantity: record.quantity,
        displayQuantity: `+${record.quantity}`,
        reason: record.reason,
        remarks: record.remarks,
        createdAt: record.createdAt,
      })),

      ...stockOuts.map((record) => ({
        _id: record._id,
        recordId: record.stockOutId,
        type: "Stock Out",
        product: record.product,
        quantity: record.quantity,
        displayQuantity: `-${record.quantity}`,
        reason: record.reason,
        remarks: record.remarks,
        createdAt: record.createdAt,
      })),
    ];

    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory records",
      error: error.message,
    });
  }
};
