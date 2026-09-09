import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, default: "" },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    images: [{ type: String }],
    specs: [{ type: String }],
    description: { type: String, default: "" },
    variants: { type: [variantSchema], validate: (v) => v.length > 0 },
    badge: { type: String, enum: ["", "NEW", "BESTSELLER"], default: "" },
    isViral: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.virtual("minPrice").get(function () {
  if (!this.variants?.length) return 0;
  return Math.min(...this.variants.map((v) => v.discountPrice || v.price));
});

productSchema.virtual("totalStock").get(function () {
  return (this.variants || []).reduce((sum, v) => sum + v.stock, 0);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
