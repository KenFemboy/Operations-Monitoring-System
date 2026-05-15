import Sale from "../../models/Sale.js";
import { getBranchFilter } from "../../utils/branchFilter.js";
import {
  assertCanAccessBranch,
  getUserBranchId,
  isSuperAdmin,
} from "../../utils/branchAccess.js";
import mongoose from "mongoose";

const getSalesBranchFilter = (req) => {
  if (isSuperAdmin(req.user) && req.query?.branchId) {
    return { branch: req.query.branchId };
  }

  return getBranchFilter(req);
};

const getSalesAggregateBranchFilter = (req) => {
  const branchFilter = getSalesBranchFilter(req);

  if (
    branchFilter.branch &&
    mongoose.Types.ObjectId.isValid(branchFilter.branch)
  ) {
    return {
      ...branchFilter,
      branch: new mongoose.Types.ObjectId(branchFilter.branch),
    };
  }

  return branchFilter;
};

const calculateBuffetPrice = ({ customerType, isSenior, isPWD, customPrice }) => {
  let basePrice = 0;
  const numericCustomPrice =
    customPrice === "" || customPrice === undefined || customPrice === null
      ? null
      : Number(customPrice);

  if (numericCustomPrice !== null && !Number.isNaN(numericCustomPrice)) {
    basePrice = Math.max(numericCustomPrice, 0);
  } else {
    if (customerType === "kid") {
      basePrice = 0;
    }

    if (customerType === "adultUnder4ft") {
      basePrice = 150;
    }

    if (customerType === "adult") {
      basePrice = 299;
    }
  }

  const hasDiscount = isSenior || isPWD;
  const discount = basePrice > 0 && hasDiscount ? 50 : 0;
  const totalAmount = Math.max(basePrice - discount, 0);

  return {
    basePrice,
    customPrice: numericCustomPrice !== null && !Number.isNaN(numericCustomPrice)
      ? Math.max(numericCustomPrice, 0)
      : null,
    discount,
    totalAmount,
  };
};

export const createSale = async (req, res) => {
  try {
    const {
      saleDate,
      serviceType,
      customerName,
      customerType,
      isSenior,
      isPWD,
      customPrice,
      remarks,
    } = req.body;

    if (!saleDate || !serviceType || !customerType) {
      return res.status(400).json({
        success: false,
        message: "Sale date, service type, and customer type are required",
      });
    }

    if (!["lunch", "dinner"].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: "Service type must be lunch or dinner",
      });
    }

    if (!["kid", "adultUnder4ft", "adult"].includes(customerType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer type",
      });
    }

    const price = calculateBuffetPrice({
      customerType,
      isSenior: Boolean(isSenior),
      isPWD: Boolean(isPWD),
      customPrice,
    });

    const branch = isSuperAdmin(req.user)
      ? req.body.branch || req.body.branchId
      : getUserBranchId(req.user);

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch is required",
      });
    }

    const sale = await Sale.create({
      saleDate,
      serviceType,
      customerName,
      customerType,
      isSenior: Boolean(isSenior),
      isPWD: Boolean(isPWD),
      basePrice: price.basePrice,
      customPrice: price.customPrice,
      discount: price.discount,
      totalAmount: price.totalAmount,
      remarks,
      branch,
    });

    res.status(201).json({
      success: true,
      message: "Sale recorded successfully",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create sale",
      error: error.message,
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const { startDate, endDate, serviceType } = req.query;

    const filter = { ...getSalesBranchFilter(req), isArchived: { $ne: true } };

    if (startDate && endDate) {
      filter.saleDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (serviceType && serviceType !== "all") {
      filter.serviceType = serviceType;
    }

    const sales = await Sale.find(filter).sort({
      saleDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales",
      error: error.message,
    });
  }
};

export const getDailySales = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const match = {
      ...getSalesAggregateBranchFilter(req),
      isArchived: { $ne: true },
      saleDate: date,
    };

    const summary = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$serviceType",
          totalCustomers: { $sum: 1 },
          totalBaseSales: { $sum: "$basePrice" },
          totalDiscount: { $sum: "$discount" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const lunch = summary.find((item) => item._id === "lunch");
    const dinner = summary.find((item) => item._id === "dinner");

    const dailyTotal = summary.reduce((sum, item) => sum + item.totalSales, 0);

    res.status(200).json({
      success: true,
      data: {
      date,
      lunch: lunch || {
        _id: "lunch",
        totalCustomers: 0,
        totalBaseSales: 0,
        totalDiscount: 0,
        totalSales: 0,
      },
      dinner: dinner || {
        _id: "dinner",
        totalCustomers: 0,
        totalBaseSales: 0,
        totalDiscount: 0,
        totalSales: 0,
      },
      dailyTotal,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily sales",
      error: error.message,
    });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    const monthString = String(month).padStart(2, "0");
    const startDate = `${year}-${monthString}-01`;
    const endDate = `${year}-${monthString}-31`;

    const match = {
      ...getSalesAggregateBranchFilter(req),
      isArchived: { $ne: true },
      saleDate: { $gte: startDate, $lte: endDate },
    };

    const summary = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            saleDate: "$saleDate",
            serviceType: "$serviceType",
          },
          totalCustomers: { $sum: 1 },
          totalDiscount: { $sum: "$discount" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.saleDate": 1,
        },
      },
    ]);

    const monthlyTotal = summary.reduce((sum, item) => {
      return sum + item.totalSales;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
      year,
      month: monthString,
      summary,
      monthlyTotal,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly sales",
      error: error.message,
    });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale record not found",
      });
    }

    assertCanAccessBranch(req, sale.branch);

    sale.isArchived = true;
    sale.archivedAt = new Date();
    sale.archivedBy = req.user?._id || req.user?.id || null;
    sale.archiveReason = req.body?.reason || "No reason provided";
    await sale.save();

    res.status(200).json({
      success: true,
      message: "Sale archived successfully",
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to archive sale",
      error: error.message,
    });
  }
};
