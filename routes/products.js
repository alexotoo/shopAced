import express from "express";
import mongoose from "mongoose";

import multer from "multer";
import checkAuth from "../Auth/check-auth.js";
import Product from "../models/product.js";

const router = express.Router();
//multer storage strategies
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

//gets all products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price productImage _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3500/products/" + doc._id,
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

//post products
router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: `A ${result.name} product was created`,
        createdProduct: {
          id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: "GET",
            url: "http://localhost:3500/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({ error: err });
    });
});

//get a product
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        return res.status(200).json({
          product: doc,
          request: {
            type: "GET",
          },
        });
      }
      return res.status(404).json({ message: "Invalid ID provided " });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//update a product
router.patch("/:productId", checkAuth, (req, res, next) => {
  id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//delete a product
router.delete("/:productId", checkAuth, (req, res, next) => {
  id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

export default router;
