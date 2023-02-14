require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const dbConnect = require("./configs/dbConnect");
const mongoose = require("mongoose");
const cors = require('cors');
const corsOptions = require('./configs/corsOptions');
const { logEvents, logger } = require('./middlewares/logger');
const errorHandle = require('./middlewares/errorHandler');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;

dbConnect();

// middlewares
app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(errorHandle);

// app routes
app.use(require('./routes'));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("connected to mongoose database");
    console.log(`server is running on port: ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongooseDBLog.log");
});
