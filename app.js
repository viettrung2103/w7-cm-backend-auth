require("dotenv").config();
const express = require("express");
const app = express();
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const {
  unknownEndpoint,
  errorHandler,
} = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");

// Middlewares
app.use(cors());
app.use(express.json());

connectDB();

app.use(morgan("dev"));

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
// Use the userRouter for all "/jobs" routes
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })
