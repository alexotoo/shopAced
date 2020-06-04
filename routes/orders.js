const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../Auth/check-auth");

const Order = require("../models/order");
const Product = require("../models/product");

//incoming GET order request
router.get("/", checkAuth, (req, res, next) => {
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
router.post("/", checkAuth, (req, res, next) => {
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
router.get("/:orderId", checkAuth, (req, res, next) => {
  const id = req.params.orderID;
  res.status(200).json({
    message: "oder details",
    orderId: req.params.orderId,
  });
});

//delete particular order
router.delete("/:orderId", checkAuth, (req, res, next) => {
  res.status(200).json({
    message: "deleted orders",
    orderId: req.params.orderId,
  });
});

module.exports = router;
