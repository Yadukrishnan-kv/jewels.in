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
    themeColors: {
      primary: { type: String, default: "#1a1a1a" },
      secondary: { type: String, default: "#efede9" },
      accent: { type: String, default: "#142e25" },
      accentLight: { type: String, default: "#1f4236" },
      border: { type: String, default: "#d9cfbd" },
    },
    currencySymbol: { type: String, default: "₹" },
    metaDescription: { type: String, default: "" },
    sectionTitles: {
      collectionsTitle: { type: String, default: "Collections" },
      viralsTitle: { type: String, default: "Virals You searching for" },
      minimalGirliesTitle: { type: String, default: "For Minimal Girlies" },
      testimonialsTitle: { type: String, default: "Our DMs Say It All" },
      storyTitle: { type: String, default: "Slaying in the Style" },
      relatedProductsTitle: { type: String, default: "YOU MAY ALSO LIKE" },
      searchPageTitle: { type: String, default: "Our Collection" },
      searchPageSubtitle: { type: String, default: "Discover our exquisite collection of handcrafted jewelry" },
      contactPageTitle: { type: String, default: "Get in Touch" },
      contactPageSubtitle: {
        type: String,
        default: "Have questions? We're here to help. Contact us through any of the channels below or send us a message.",
      },
      trackPageTitle: { type: String, default: "Track Your Package" },
      trackPageSubtitle: { type: String, default: "Enter your order number and phone number to check your delivery status." },
      cartPageTitle: { type: String, default: "Your Shopping Cart" },
      wishlistPageTitle: { type: String, default: "My Wishlist" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SiteSettings", siteSettingsSchema);
