import Employee from "../../models/Employee.js";
import Attendance from "../../models/Attendance.js";
import Payroll from "../../models/Payroll.js";
import Contribution from "../../models/Contribution.js";
import IncidentReport from "../../models/IncidentReport.js";
import NoticeToExplain from "../../models/NoticeToExplain.js";
import Product from "../../models/Product.js";
import Purchase from "../../models/Purchase.js";
import StockIn from "../../models/StockIn.js";
import StockOut from "../../models/StockOut.js";
import Sale from "../../models/Sale.js";
import Feedback from "../../models/Feedback.js";
import Leave from "../../models/Leave.js";
import Plantilla from "../../models/Plantilla.js";
import mongoose from "mongoose";
import { getBranchFilter } from "../../utils/branchFilter.js";

const getDateRanges = () => {
  const today = new Date();

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDateString = today.toISOString().split("T")[0];
  const monthPrefix = `${currentYear}-${currentMonth}`;

  return {
    today,
    startOfMonth,
    startOfToday,
    endOfToday,
    todayDateString,
    monthPrefix,
  };
};

const getAggregateBranchFilter = (req) => {
  const branchFilter = getBranchFilter(req);

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

/* =========================
   OVERALL SUMMARY
========================= */
export const getOverallSummary = async (req, res) => {
  try {
    const { monthPrefix } = getDateRanges();

    const branchFilter = getBranchFilter(req);
    const aggregateBranchFilter = getAggregateBranchFilter(req);

    const [
      totalEmployees,
      activeEmployees,
      totalProducts,
      lowStockProducts,
      totalFeedback,
      monthlySales,
      feedbackAverage,
    ] = await Promise.all([
      Employee.countDocuments(branchFilter),
      Employee.countDocuments({ ...branchFilter, employmentStatus: "active" }),

      Product.countDocuments(branchFilter),
      Product.countDocuments({ ...branchFilter, status: "Low Stock" }),

      Feedback.countDocuments(branchFilter),

      Sale.aggregate([
        { $match: { ...aggregateBranchFilter, saleDate: { $regex: `^${monthPrefix}` } } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            totalCustomers: { $sum: 1 },
          },
        },
      ]),

      Feedback.aggregate([
        { $match: aggregateBranchFilter },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlySales: monthlySales[0]?.totalSales || 0,
        monthlyCustomers: monthlySales[0]?.totalCustomers || 0,
        totalEmployees,
        activeEmployees,
        totalProducts,
        lowStockProducts,
        totalFeedback,
        averageRating: feedbackAverage[0]?.averageRating || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load overall summary",
      error: error.message,
    });
  }
};

/* =========================
   SALES ANALYTICS
========================= */
export const getSalesAnalytics = async (req, res) => {
  try {
    const { monthPrefix, todayDateString, startOfMonth } = getDateRanges();

    const branchFilter = getBranchFilter(req);
    const aggregateBranchFilter = getAggregateBranchFilter(req);

    const monthlySales = await Sale.aggregate([
      { $match: { ...aggregateBranchFilter, saleDate: { $regex: `^${monthPrefix}` } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const dailySales = await Sale.aggregate([
      { $match: { ...aggregateBranchFilter, saleDate: todayDateString } },
      {
        $group: {
          _id: "$serviceType",
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const salesByDay = await Sale.aggregate([
      { $match: { ...aggregateBranchFilter, createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyTotal: monthlySales[0]?.totalSales || 0,
        monthlyCustomers: monthlySales[0]?.totalCustomers || 0,
        dailySales,
        salesByDay,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load sales analytics",
      error: error.message,
    });
  }
};

/* =========================
   EMPLOYEE ANALYTICS
========================= */
export const getEmployeeAnalytics = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const [
      total,
      active,
      inactive,
      resigned,
      terminated,
    ] = await Promise.all([
      Employee.countDocuments(branchFilter),
      Employee.countDocuments({ ...branchFilter, employmentStatus: "active" }),
      Employee.countDocuments({ ...branchFilter, employmentStatus: "inactive" }),
      Employee.countDocuments({ ...branchFilter, employmentStatus: "resigned" }),
      Employee.countDocuments({ ...branchFilter, employmentStatus: "terminated" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        resigned,
        terminated,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load employee analytics",
      error: error.message,
    });
  }
};

/* =========================
   ATTENDANCE + PAYROLL
========================= */
export const getAttendancePayrollAnalytics = async (req, res) => {
  try {
    const { startOfToday, endOfToday } = getDateRanges();

    const branchFilter = getBranchFilter(req);

    const [
      totalAttendance,
      todayAttendance,

      totalPayrolls,
      pendingPayrolls,
      donePayrolls,

      totalContributions,
    ] = await Promise.all([
      Attendance.countDocuments(branchFilter),
      Attendance.countDocuments({ ...branchFilter, date: { $gte: startOfToday, $lt: endOfToday } }),

      Payroll.countDocuments(branchFilter),
      Payroll.countDocuments({ ...branchFilter, status: "pending" }),
      Payroll.countDocuments({ ...branchFilter, status: "done" }),

      Contribution.countDocuments(branchFilter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        attendance: {
          totalRecords: totalAttendance,
          todayRecords: todayAttendance,
        },

        payroll: {
          total: totalPayrolls,
          pending: pendingPayrolls,
          done: donePayrolls,
        },

        contributions: {
          total: totalContributions,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load attendance and payroll analytics",
      error: error.message,
    });
  }
};

/* =========================
   INVENTORY ANALYTICS
========================= */
export const getInventoryAnalytics = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const [
      products,
      lowStock,
      outOfStock,

      purchases,
      pendingPurchases,

      stockIn,
      stockOut,
    ] = await Promise.all([
      Product.countDocuments(branchFilter),
      Product.countDocuments({ ...branchFilter, status: "Low Stock" }),
      Product.countDocuments({ ...branchFilter, status: "Out of Stock" }),

      Purchase.countDocuments(branchFilter),
      Purchase.countDocuments({ ...branchFilter, status: "Pending" }),

      StockIn.countDocuments(branchFilter),
      StockOut.countDocuments(branchFilter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        lowStock,
        outOfStock,
        purchases,
        pendingPurchases,
        stockIn,
        stockOut,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load inventory analytics",
      error: error.message,
    });
  }
};

/* =========================
   FEEDBACK ANALYTICS
========================= */
export const getFeedbackAnalytics = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);
    const feedbackBranchMatch = getAggregateBranchFilter(req);

    const totalFeedback = await Feedback.countDocuments(branchFilter);

    const feedbackAverage = await Feedback.aggregate([
      { $match: feedbackBranchMatch },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const feedbackByBranch = await Feedback.aggregate([
      { $match: feedbackBranchMatch },
      {
        $group: {
          _id: "$branch",
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "_id",
          foreignField: "_id",
          as: "branch",
        },
      },
      {
        $unwind: {
          path: "$branch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          branchId: "$_id",
          branchName: { $ifNull: ["$branch.branchName", "Unknown Branch"] },
          averageRating: 1,
          totalFeedback: 1,
        },
      },
      {
        $sort: { averageRating: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFeedback,
        averageRating: feedbackAverage[0]?.averageRating || 0,
        byBranch: feedbackByBranch,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load feedback analytics",
      error: error.message,
    });
  }
};

/* =========================
   IR + NTE ANALYTICS
========================= */
export const getIRNTEAnalytics = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const [
      totalIR,
      openIR,
      resolvedIR,

      totalNTE,
      pendingNTE,
      submittedNTE,
      closedNTE,
    ] = await Promise.all([
      IncidentReport.countDocuments(branchFilter),
      IncidentReport.countDocuments({ ...branchFilter, status: "open" }),
      IncidentReport.countDocuments({ ...branchFilter, status: "resolved" }),

      NoticeToExplain.countDocuments(branchFilter),
      NoticeToExplain.countDocuments({ ...branchFilter, status: "pending" }),
      NoticeToExplain.countDocuments({ ...branchFilter, status: "submitted" }),
      NoticeToExplain.countDocuments({ ...branchFilter, status: "closed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        incidentReports: {
          total: totalIR,
          open: openIR,
          resolved: resolvedIR,
        },

        nte: {
          total: totalNTE,
          pending: pendingNTE,
          submitted: submittedNTE,
          closed: closedNTE,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load IR and NTE analytics",
      error: error.message,
    });
  }
};

/* =========================
   LEAVE + PLANTILLA
========================= */
export const getLeavePlantillaAnalytics = async (req, res) => {
  try {
    const branchFilter = getBranchFilter(req);

    const [
      totalLeaves,
      pendingLeaves,
      approvedLeaves,

      totalPlantilla,
      openPlantilla,
      filledPlantilla,
      understaffedPlantilla,
      overstaffedPlantilla,
    ] = await Promise.all([
      Leave.countDocuments(branchFilter),
      Leave.countDocuments({ ...branchFilter, status: "pending" }),
      Leave.countDocuments({ ...branchFilter, status: "approved" }),

      Plantilla.countDocuments(branchFilter),
      Plantilla.countDocuments({ ...branchFilter, status: "open" }),
      Plantilla.countDocuments({ ...branchFilter, status: "filled" }),
      Plantilla.countDocuments({ ...branchFilter, status: "understaffed" }),
      Plantilla.countDocuments({ ...branchFilter, status: "overstaffed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        leaves: {
          total: totalLeaves,
          pending: pendingLeaves,
          approved: approvedLeaves,
        },

        plantilla: {
          total: totalPlantilla,
          open: openPlantilla,
          filled: filledPlantilla,
          understaffed: understaffedPlantilla,
          overstaffed: overstaffedPlantilla,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load leave and plantilla analytics",
      error: error.message,
    });
  }
};

/* =========================
   OPTIONAL: KEEP OLD FULL ENDPOINT
========================= */
export const getDashboardAnalytics = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message:
        "Use the split dashboard endpoints: /overall, /sales, /employees, /attendance-payroll, /inventory, /feedback, /ir-nte, /leave-plantilla",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics",
      error: error.message,
    });
  }
};
