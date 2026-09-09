import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    embedUrl: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Reel", reelSchema);
