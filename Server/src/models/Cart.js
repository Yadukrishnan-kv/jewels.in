import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    slug: String,
    name: String,
    image: String,
    variantId: String,
    variantLabel: String,
    price: Number,
    stock: Number,
    qty: Number,
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
