import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    siteName: { type: String, default: "The Halla" },
    tagline: { type: String, default: "DO CONNECT GET ACCESSORISED" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    offerBarText: { type: String, default: "DO CONNECT GET ACCESSORISED" },
    offerBarEnabled: { type: Boolean, default: true },
    whatsappNumber: { type: String, default: "919999999999" },
    contactPhone: { type: String, default: "+91 99999 99999" },
    contactEmail: { type: String, default: "hello@halajewels.in" },
    address: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
