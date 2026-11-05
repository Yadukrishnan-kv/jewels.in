import Wishlist from "../models/Wishlist.js";

export async function getWishlist(req, res) {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  res.json({ items: wishlist?.items || [] });
}

export async function saveWishlist(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ message: "items must be an array" });

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { upsert: true, new: true }
  );
  res.json({ items: wishlist.items });
}
