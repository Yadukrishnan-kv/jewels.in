import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["hero", "promo-large", "promo-small", "mid-promo", "story"],
      required: true,
    },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    linkUrl: { type: String, default: "" },
    ctaLabel: { type: String, default: "Shop now" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
