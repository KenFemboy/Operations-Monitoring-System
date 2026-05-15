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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };
    const activeAggregateFilter = { ...aggregateBranchFilter, isArchived: { $ne: true } };

    const [
      totalEmployees,
      activeEmployees,
      totalProducts,
      lowStockProducts,
      totalFeedback,
      monthlySales,
      feedbackAverage,
    ] = await Promise.all([
      Employee.countDocuments(activeFilter),
      Employee.countDocuments({ ...activeFilter, employmentStatus: "active" }),

      Product.countDocuments(activeFilter),
      Product.countDocuments({ ...activeFilter, status: "Low Stock" }),

      Feedback.countDocuments(activeFilter),

      Sale.aggregate([
        { $match: { ...activeAggregateFilter, saleDate: { $regex: `^${monthPrefix}` } } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            totalCustomers: { $sum: 1 },
          },
        },
      ]),

      Feedback.aggregate([
        { $match: activeAggregateFilter },
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

    const aggregateBranchFilter = getAggregateBranchFilter(req);
    const activeAggregateFilter = { ...aggregateBranchFilter, isArchived: { $ne: true } };

    const monthlySales = await Sale.aggregate([
      { $match: { ...activeAggregateFilter, saleDate: { $regex: `^${monthPrefix}` } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const dailySales = await Sale.aggregate([
      { $match: { ...activeAggregateFilter, saleDate: todayDateString } },
      {
        $group: {
          _id: "$serviceType",
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const salesByDay = await Sale.aggregate([
      { $match: { ...activeAggregateFilter, createdAt: { $gte: startOfMonth } } },
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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };

    const [
      total,
      active,
      inactive,
      resigned,
      terminated,
    ] = await Promise.all([
      Employee.countDocuments(activeFilter),
      Employee.countDocuments({ ...activeFilter, employmentStatus: "active" }),
      Employee.countDocuments({ ...activeFilter, employmentStatus: "inactive" }),
      Employee.countDocuments({ ...activeFilter, employmentStatus: "resigned" }),
      Employee.countDocuments({ ...activeFilter, employmentStatus: "terminated" }),
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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };

    const [
      totalAttendance,
      todayAttendance,

      totalPayrolls,
      pendingPayrolls,
      donePayrolls,

      totalContributions,
    ] = await Promise.all([
      Attendance.countDocuments(activeFilter),
      Attendance.countDocuments({ ...activeFilter, date: { $gte: startOfToday, $lt: endOfToday } }),

      Payroll.countDocuments(activeFilter),
      Payroll.countDocuments({ ...activeFilter, status: "pending" }),
      Payroll.countDocuments({ ...activeFilter, status: "done" }),

      Contribution.countDocuments(activeFilter),
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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };

    const [
      products,
      lowStock,
      outOfStock,

      purchases,
      pendingPurchases,

      stockIn,
      stockOut,
    ] = await Promise.all([
      Product.countDocuments(activeFilter),
      Product.countDocuments({ ...activeFilter, status: "Low Stock" }),
      Product.countDocuments({ ...activeFilter, status: "Out of Stock" }),

      Purchase.countDocuments(activeFilter),
      Purchase.countDocuments({ ...activeFilter, status: "Pending" }),

      StockIn.countDocuments(activeFilter),
      StockOut.countDocuments(activeFilter),
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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };
    const activeFeedbackMatch = { ...feedbackBranchMatch, isArchived: { $ne: true } };

    const totalFeedback = await Feedback.countDocuments(activeFilter);

    const feedbackAverage = await Feedback.aggregate([
      { $match: activeFeedbackMatch },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const feedbackByBranch = await Feedback.aggregate([
      { $match: activeFeedbackMatch },
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
      IncidentReport.countDocuments(activeFilter),
      IncidentReport.countDocuments({ ...activeFilter, status: "open" }),
      IncidentReport.countDocuments({ ...activeFilter, status: "resolved" }),

      NoticeToExplain.countDocuments(activeFilter),
      NoticeToExplain.countDocuments({ ...activeFilter, status: "pending" }),
      NoticeToExplain.countDocuments({ ...activeFilter, status: "submitted" }),
      NoticeToExplain.countDocuments({ ...activeFilter, status: "closed" }),
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
    const activeFilter = { ...branchFilter, isArchived: { $ne: true } };

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
      Leave.countDocuments(activeFilter),
      Leave.countDocuments({ ...activeFilter, status: "pending" }),
      Leave.countDocuments({ ...activeFilter, status: "approved" }),

      Plantilla.countDocuments(activeFilter),
      Plantilla.countDocuments({ ...activeFilter, status: "open" }),
      Plantilla.countDocuments({ ...activeFilter, status: "filled" }),
      Plantilla.countDocuments({ ...activeFilter, status: "understaffed" }),
      Plantilla.countDocuments({ ...activeFilter, status: "overstaffed" }),
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
