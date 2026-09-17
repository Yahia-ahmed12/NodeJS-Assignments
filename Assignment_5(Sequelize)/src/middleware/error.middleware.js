import { NODE_ENV } from "../config/config.js";

export const globalErrorHandling = (error, req, res, next) => {
  if (error.name?.toLowerCase()?.includes("sequelize")) {
    error.cause = { status: 400 };
  }
  const status = error.cause?.status ?? 500;
  return res.status(status).json({
    message: error.message || "Internal Server Error",
    status,
    ...(NODE_ENV === "development" && {
      stack: error.stack,
      error,
    }),
  });
};
