import { NODE_ENV } from "../config/config.js";

export const globalErrorHandling = (error, req, res, next) => {
  if (error.name?.toLowerCase()?.includes("sequelize")) {
    error.cause = { status: 400 };
  }
  return res.status(error.cause?.status ?? 500).json({
    error_message: error.message || "server error",
    error: NODE_ENV == "development" ? error : undefined,
    stack: NODE_ENV == "development" ? error.stack : undefined,
  });
};
