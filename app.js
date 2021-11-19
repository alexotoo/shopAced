import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

//Server PORT
const port = process.env.PORT || 3500;

//routePaTHS====
import productRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import userRoutes from "./routes/user.js";

//data connection, this password has been hardcodec in nodemon.json file for easy reload
mongoose.connect(process.env.DB_SERVER + process.env.DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

//use middlewares=====
app.use(morgan("short"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Routes===========
//Home Page!!
app.get("/", (req, res) => res.send("Welcome Home"));
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

app.listen(port, () => console.log(`server running on port:${port}`));
