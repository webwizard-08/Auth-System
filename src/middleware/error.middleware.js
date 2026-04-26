export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  if (process.env.NODE_ENV !== "production") {
    return res.status(status).json({ message, stack: err.stack });
  }
  return res.status(status).json({ message });
}
