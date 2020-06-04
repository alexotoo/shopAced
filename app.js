const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

//routePaTHS====
const productRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const userRoutes = require("./routes/user");

//data connection, this password has been hardcodec in nodemon.json file for easy reload
mongoose.connect(
  process.env.DB_SERVER + process.env.MONGO_ATLAS_PW + process.env.DB_KEY,
  {
    useNewUrlParser: true,
  }
);
mongoose.set("useCreateIndex", true);

//use middlewares=====
app.use(morgan("short"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Routes===========
//Home Page!!
app.get("/", (req, res) => res.send("Welcom Home"));
//Products!!
app.use("/products", productRoutes);
//orders!!
app.use("/orders", ordersRoutes);
app.use("/user", userRoutes);

//error handling=====
app.use((req, res, next) => {
  const error = new Error("Page Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
