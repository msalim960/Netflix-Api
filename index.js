const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
const users = require("./routes/users");
const genres = require("./routes/genres");
const auth = require("./routes/auth");
const error = require('./middleware/error')
const movies = require("./routes/movies");

const app = express();

process.on("unhandledRejection", (ex) => {
  throw ex;
});


winston.add(
  new winston.transports.File({ filename: "logfile.log", level: "error" })
);

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the Database");
  })
  .catch((err) => {
    console.log("Unable to connet to the Database", err);
  });
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use(error)

app.listen(5500, () => {
  console.log("Backend Services Running");
});
