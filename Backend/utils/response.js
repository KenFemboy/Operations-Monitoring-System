export const sendSuccess = (
  res,
  data = null,
  message,
  statusCode = 200,
  extra = {},
) =>
  res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
    ...extra,
  });

export const sendError = (
  res,
  {
    statusCode = 500,
    message = "Server error",
    error,
  } = {},
) =>
  res.status(statusCode).json({
    success: false,
    message,
    ...(error ? { error } : {}),
  });
