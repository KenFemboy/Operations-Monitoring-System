import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import StockIn from "../models/StockIn.js";
import StockOut from "../models/StockOut.js";

const updateProductStatus = (product) => {
  if (product.currentStock === 0) {
    product.status = "Out of Stock";
  } else if (product.currentStock <= product.minimumStock) {
    product.status = "Low Stock";
  } else {
    product.status = "Available";
  }
};

// =======================
// PRODUCT CONTROLLERS
// =======================

export const createProduct = async (req, res) => {
  try {
    const { name, category, unit, minimumStock } = req.body;

    const product = await Product.create({
      name,
      category,
      unit,
      minimumStock,
      currentStock: 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
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
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
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
    const product = await Product.findById(req.params.id);

    const stockIns = await StockIn.find({ product: req.params.id })
      .populate("product")
      .sort({ createdAt: -1 });

    const stockOuts = await StockOut.find({ product: req.params.id })
      .populate("product")
      .sort({ createdAt: -1 });

    const purchases = await Purchase.find({ product: req.params.id })
      .populate("product")
      .sort({ createdAt: -1 });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
      stockIns,
      stockOuts,
      purchases,
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

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.unit = unit || product.unit;
    product.minimumStock = minimumStock ?? product.minimumStock;

    updateProductStatus(product);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
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

    const purchase = await Purchase.create({
      product,
      supplierName,
      quantity,
      unitCost,
      purchaseDate,
      remarks,
    });

    const populatedPurchase = await Purchase.findById(purchase._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      purchase: populatedPurchase,
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
    const purchases = await Purchase.find()
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      purchases,
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
    const purchase = await Purchase.findById(req.params.id);

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

    const product = await Product.findById(purchase.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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
    });

    res.status(200).json({
      success: true,
      message: "Purchase received and stock added",
      purchase,
      product,
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
    const purchase = await Purchase.findById(req.params.id);

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

    purchase.status = "Cancelled";
    await purchase.save();

    res.status(200).json({
      success: true,
      message: "Purchase cancelled successfully",
      purchase,
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
    const { product, quantity, reason, addedBy, remarks } = req.body;

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    existingProduct.currentStock += Number(quantity);
    updateProductStatus(existingProduct);
    await existingProduct.save();

    const stockIn = await StockIn.create({
      product,
      quantity,
      reason,
      addedBy,
      remarks,
    });

    const populatedStockIn = await StockIn.findById(stockIn._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      stockIn: populatedStockIn,
      product: existingProduct,
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
    const stockIns = await StockIn.find()
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stockIns,
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
    const { product, quantity, reason, releasedBy, remarks } = req.body;

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (Number(quantity) > existingProduct.currentStock) {
      return res.status(400).json({
        success: false,
        message: "Cannot stock out. Not enough stock available.",
      });
    }

    existingProduct.currentStock -= Number(quantity);
    updateProductStatus(existingProduct);
    await existingProduct.save();

    const stockOut = await StockOut.create({
      product,
      quantity,
      reason,
      releasedBy,
      remarks,
    });

    const populatedStockOut = await StockOut.findById(stockOut._id).populate(
      "product"
    );

    res.status(201).json({
      success: true,
      message: "Stock deducted successfully",
      stockOut: populatedStockOut,
      product: existingProduct,
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
    const stockOuts = await StockOut.find()
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stockOuts,
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

    if (!type || type === "all" || type === "stock-in") {
      stockIns = await StockIn.find(dateFilter)
        .populate("product")
        .sort({ createdAt: -1 });
    }

    if (!type || type === "all" || type === "stock-out") {
      stockOuts = await StockOut.find(dateFilter)
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
        user: record.addedBy,
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
        user: record.releasedBy,
        remarks: record.remarks,
        createdAt: record.createdAt,
      })),
    ];

    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory records",
      error: error.message,
    });
  }
};