import api from "../../../api/axiosInstance";

const ARCHIVE_PREFIX = "/archive";

export const getArchivedEmployees = () =>
  api.get(`${ARCHIVE_PREFIX}/employees`);
export const restoreEmployee = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/employees/${id}/restore`);

export const getArchivedSales = () =>
  api.get(`${ARCHIVE_PREFIX}/sales`);
export const restoreSale = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/sales/${id}/restore`);

export const getArchivedFeedback = () =>
  api.get(`${ARCHIVE_PREFIX}/feedback`);
export const restoreFeedback = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/feedback/${id}/restore`);

export const getArchivedProducts = () =>
  api.get(`${ARCHIVE_PREFIX}/inventory/products`);
export const restoreProduct = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/inventory/products/${id}/restore`);

export const getArchivedPurchases = () =>
  api.get(`${ARCHIVE_PREFIX}/inventory/purchases`);
export const restorePurchase = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/inventory/purchases/${id}/restore`);

export const getArchivedStockIns = () =>
  api.get(`${ARCHIVE_PREFIX}/inventory/stock-in`);
export const restoreStockIn = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/inventory/stock-in/${id}/restore`);

export const getArchivedStockOuts = () =>
  api.get(`${ARCHIVE_PREFIX}/inventory/stock-out`);
export const restoreStockOut = (id) =>
  api.patch(`${ARCHIVE_PREFIX}/inventory/stock-out/${id}/restore`);
