export const globalErrorHandling = (error, req, res, next) => {
  const status = error.cause?.status ?? 500;
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return res.status(status).json({
      success: false,
      error_message: status === 500 ? "Internal Server Error" : error.message,
      ...(error.issues && { issues: error.issues }),
    });
  }

  return res.status(status).json({
    success: false,
    error_message: error.message || "server error",
    issues: error.issues,
    extra: error.cause,
    error,
    stack: error.stack,
  });
};
