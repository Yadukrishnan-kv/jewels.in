import Cart from "../models/Cart.js";

export async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({ items: cart?.items || [] });
}

export async function saveCart(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: "items must be an array" });

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { upsert: true, new: true }
  );
  res.json({ items: cart.items });
}
