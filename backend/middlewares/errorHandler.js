const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
