const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const blogRoutes = require("./routes/blogRoutes");
const usersRoutes = require("./routes/userRoutes");

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/blogs", blogRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find URL ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
