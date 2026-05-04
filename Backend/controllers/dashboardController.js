import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Payroll from "../models/Payroll.js";
import Contribution from "../models/Contribution.js";
import IncidentReport from "../models/IncidentReport.js";
import NoticeToExplain from "../models/NoticeToExplain.js";
import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import StockIn from "../models/StockIn.js";
import StockOut from "../models/StockOut.js";
import Sale from "../models/Sale.js";
import Feedback from "../models/Feedback.js";
import Leave from "../models/Leave.js";
import Plantilla from "../models/Plantilla.js";

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

/* =========================
   OVERALL SUMMARY
========================= */
export const getOverallSummary = async (req, res) => {
  try {
    const { monthPrefix } = getDateRanges();

    const [
      totalEmployees,
      activeEmployees,
      totalProducts,
      lowStockProducts,
      totalFeedback,
      monthlySales,
      feedbackAverage,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ employmentStatus: "active" }),

      Product.countDocuments(),
      Product.countDocuments({ status: "Low Stock" }),

      Feedback.countDocuments(),

      Sale.aggregate([
        {
          $match: {
            saleDate: { $regex: `^${monthPrefix}` },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            totalCustomers: { $sum: 1 },
          },
        },
      ]),

      Feedback.aggregate([
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

    const monthlySales = await Sale.aggregate([
      {
        $match: {
          saleDate: { $regex: `^${monthPrefix}` },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const dailySales = await Sale.aggregate([
      {
        $match: {
          saleDate: todayDateString,
        },
      },
      {
        $group: {
          _id: "$serviceType",
          totalSales: { $sum: "$totalAmount" },
          totalCustomers: { $sum: 1 },
        },
      },
    ]);

    const salesByDay = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
        },
      },
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
    const [
      total,
      active,
      inactive,
      resigned,
      terminated,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ employmentStatus: "active" }),
      Employee.countDocuments({ employmentStatus: "inactive" }),
      Employee.countDocuments({ employmentStatus: "resigned" }),
      Employee.countDocuments({ employmentStatus: "terminated" }),
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

    const [
      totalAttendance,
      todayAttendance,

      totalPayrolls,
      pendingPayrolls,
      donePayrolls,

      totalContributions,
    ] = await Promise.all([
      Attendance.countDocuments(),
      Attendance.countDocuments({
        date: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      }),

      Payroll.countDocuments(),
      Payroll.countDocuments({ status: "pending" }),
      Payroll.countDocuments({ status: "done" }),

      Contribution.countDocuments(),
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
    const [
      products,
      lowStock,
      outOfStock,

      purchases,
      pendingPurchases,

      stockIn,
      stockOut,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "Low Stock" }),
      Product.countDocuments({ status: "Out of Stock" }),

      Purchase.countDocuments(),
      Purchase.countDocuments({ status: "Pending" }),

      StockIn.countDocuments(),
      StockOut.countDocuments(),
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
    const totalFeedback = await Feedback.countDocuments();

    const feedbackAverage = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const feedbackByBranch = await Feedback.aggregate([
      {
        $group: {
          _id: "$branch",
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 },
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
    const [
      totalIR,
      openIR,
      resolvedIR,

      totalNTE,
      pendingNTE,
      answeredNTE,
    ] = await Promise.all([
      IncidentReport.countDocuments(),
      IncidentReport.countDocuments({ status: "open" }),
      IncidentReport.countDocuments({ status: "resolved" }),

      NoticeToExplain.countDocuments(),
      NoticeToExplain.countDocuments({ status: "pending" }),
      NoticeToExplain.countDocuments({ status: "answered" }),
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
          answered: answeredNTE,
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
      Leave.countDocuments(),
      Leave.countDocuments({ status: "pending" }),
      Leave.countDocuments({ status: "approved" }),

      Plantilla.countDocuments(),
      Plantilla.countDocuments({ status: "open" }),
      Plantilla.countDocuments({ status: "filled" }),
      Plantilla.countDocuments({ status: "understaffed" }),
      Plantilla.countDocuments({ status: "overstaffed" }),
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