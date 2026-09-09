import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
