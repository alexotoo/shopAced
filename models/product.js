import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

export default mongoose.model("Product", productSchema);
