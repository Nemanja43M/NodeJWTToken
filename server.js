const app = require("./app");
const mongoose = require("mongoose");

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
