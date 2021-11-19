import express from "express";
import mongoose from "mongoose";
import verifyUserAuth from "../Auth/check-auth.js";

import Order from "../models/order.js";
import Product from "../models/product.js";

const router = express.Router();

//incoming GET order request
router.get("/", verifyUserAuth, (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//post add order
router.post("/", verifyUserAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: `A ${result.product} order was stored`,
        storeOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3500/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//get particular order
router.get("/:orderId", verifyUserAuth, (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: "oder details",
    orderId: req.params.orderId,
  });
});

//delete particular order
router.delete("/:orderId", verifyUserAuth, (req, res, next) => {
  res.status(200).json({
    message: "deleted orders",
    orderId: req.params.orderId,
  });
});

export default router;
