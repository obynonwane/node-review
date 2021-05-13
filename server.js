const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to DB - mongoose
const connectDB = require("./config/db");
connectDB();

//load middleware
const logger = require("./middleware/logger");

// bring in route files
const bootcamps = require("./routes/bootcamps");

//initialoze our app variable
const app = express();
//Body parser
app.use(express.json());

//trying middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(logger);
//Mount the router
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

//GET PORT FROM ENV FILER
const PORT = process.env.PORT || 5000;

//listen to a port
const server = app.listen(PORT, () => {
  console.log(
    `App running in ${process.env.NODE_ENV} mode and listening on port ${PORT}!`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process with failure (1)
  server.close(() => process.exit(1));
});
// });
