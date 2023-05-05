const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
app.use(express.json());

app.use(morgan("dev"));

const blogRoutes = require("./routes/blogRoutes");
const usersRoutes = require("./routes/userRoutes");

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/blogs", blogRoutes);

mongoose
  .connect("mongodb://localhost:27017/blogs", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    retryWrites: false,
  })
  .then(() => console.log("Connected to the DB"));

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
