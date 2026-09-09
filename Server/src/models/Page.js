import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    contentHtml: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Page", pageSchema);
