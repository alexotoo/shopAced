import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
});

export default mongoose.model("Order", orderSchema);
