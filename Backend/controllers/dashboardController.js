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

export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      resignedEmployees,
      terminatedEmployees,

      totalAttendance,
      todayAttendance,

      totalPayrolls,
      pendingPayrolls,
      donePayrolls,

      totalContributions,

      totalIR,
      openIR,
      resolvedIR,

      totalNTE,
      pendingNTE,
      answeredNTE,

      totalProducts,
      lowStockProducts,
      outOfStockProducts,

      totalPurchases,
      pendingPurchases,

      totalStockIn,
      totalStockOut,

      totalLeaves,
      pendingLeaves,
      approvedLeaves,

      totalPlantilla,
      openPlantilla,
      filledPlantilla,
      understaffedPlantilla,
      overstaffedPlantilla,

      totalFeedback,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ employmentStatus: "active" }),
      Employee.countDocuments({ employmentStatus: "inactive" }),
      Employee.countDocuments({ employmentStatus: "resigned" }),
      Employee.countDocuments({ employmentStatus: "terminated" }),

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

      IncidentReport.countDocuments(),
      IncidentReport.countDocuments({ status: "open" }),
      IncidentReport.countDocuments({ status: "resolved" }),

      NoticeToExplain.countDocuments(),
      NoticeToExplain.countDocuments({ status: "pending" }),
      NoticeToExplain.countDocuments({ status: "answered" }),

      Product.countDocuments(),
      Product.countDocuments({ status: "Low Stock" }),
      Product.countDocuments({ status: "Out of Stock" }),

      Purchase.countDocuments(),
      Purchase.countDocuments({ status: "Pending" }),

      StockIn.countDocuments(),
      StockOut.countDocuments(),

      Leave.countDocuments(),
      Leave.countDocuments({ status: "pending" }),
      Leave.countDocuments({ status: "approved" }),

      Plantilla.countDocuments(),
      Plantilla.countDocuments({ status: "open" }),
      Plantilla.countDocuments({ status: "filled" }),
      Plantilla.countDocuments({ status: "understaffed" }),
      Plantilla.countDocuments({ status: "overstaffed" }),

      Feedback.countDocuments(),
    ]);

const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
const todayDateString = today.toISOString().split("T")[0];
const monthPrefix = `${currentYear}-${currentMonth}`;

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
        employees: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: inactiveEmployees,
          resigned: resignedEmployees,
          terminated: terminatedEmployees,
        },

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

        inventory: {
          products: totalProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
          purchases: totalPurchases,
          pendingPurchases,
          stockIn: totalStockIn,
          stockOut: totalStockOut,
        },

        sales: {
          monthlyTotal: monthlySales[0]?.totalSales || 0,
          monthlyCustomers: monthlySales[0]?.totalCustomers || 0,
          dailySales,
          salesByDay,
        },

        feedback: {
          totalFeedback,
          averageRating: feedbackAverage[0]?.averageRating || 0,
          byBranch: feedbackByBranch,
        },

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
      message: "Failed to load dashboard analytics",
      error: error.message,
    });
  }
};