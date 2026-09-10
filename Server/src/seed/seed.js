import fs from "node:fs";
import path from "node:path";
import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import Product from "../models/Product.js";
import Banner from "../models/Banner.js";
import Testimonial from "../models/Testimonial.js";
import Reel from "../models/Reel.js";
import Page from "../models/Page.js";
import SiteSettings from "../models/SiteSettings.js";
import AdminUser from "../models/AdminUser.js";
import { slugify } from "../utils/slugify.js";

const RAW = "/uploads/raw/admin/uploads";
const rawDir = path.resolve("uploads/raw/admin/uploads");

function productImagePool() {
  if (!fs.existsSync(rawDir)) return [];
  return fs
    .readdirSync(rawDir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.startsWith("img_"))
    .map((f) => `${RAW}/${f.name}`);
}

// Real category cover photos scraped from halajewels.in's homepage collections grid.
const CATEGORY_DEFS = [
  { name: "Anklets", image: "6a046614d97a8_IMG_9773.webp" },
  { name: "Baby Bangles", image: "69fd82835d2d6_IMG_8845.webp" },
  { name: "Bracelets", image: "69ff5d580b872_IMG_9051.webp" },
  { name: "Cuff Bangle", image: "6a06c1e062d58_IMG_9988 2.webp" },
  { name: "Earcuffs", image: "6a7dd1d958faa_IMG_7860.webp" },
  { name: "Earings", image: "69fdcc4c93aca_IMG_8884.webp" },
  { name: "Handchain", image: "69fd873a1935a_WhatsApp Image 2026-05-08 at 12.17.55 PM.webp" },
  { name: "Hipchains", image: "6a75e958d4b3b_IMG_7192.webp" },
  { name: "Necklaces", image: "6a0194ac8b799_IMG_9261.webp" },
  { name: "Normal Sized Bangles", image: "69fd87dd7fd66_WhatsApp Image 2026-05-08 at 12.20.43 PM.webp" },
  { name: "Nosepin", image: "69fdcc2f7a0bf_IMG_8883.webp" },
  { name: "Rings Premium", image: "6a018e950e4b8_IMG_8769.webp" },
  { name: "Watches", image: "69fd8795d6d83_WhatsApp Image 2026-05-08 at 12.18.10 PM.webp" },
].map((c) => ({ ...c, image: `${RAW}/${c.image}` }));

const TAG_DEFS = [
  "For Minimal Girlies",
  "Virals You searching for",
  "Silver Collections",
  "Under 199",
  "Elegance in every drop",
  "Soft. Sensual. Stunning.",
  "Luxe in Hala",
];

const NAME_PARTS = {
  prefix: ["Aflah", "Limah", "Solh", "Zirah", "Wafa", "Naira", "Meera", "Sana", "Rumi", "Elara", "Noor", "Layla", "Vera", "Isra", "Dania"],
  style: ["Snake Chain", "Cross", "Double Layer", "Rosegold Butterfly", "Tulip", "Twist", "Beaded", "Pearl Drop", "Chunky", "Minimal", "Layered", "Charm", "Vintage", "Dainty", "Statement"],
  suffix: {
    Anklets: "Anklet",
    "Baby Bangles": "Baby Bangle",
    Bracelets: "Bracelet",
    "Cuff Bangle": "Cuff",
    Earcuffs: "Earcuff",
    Earings: "Earrings",
    Handchain: "Handchain",
    Hipchains: "Hipchain",
    Necklaces: "Necklace",
    "Normal Sized Bangles": "Bangle",
    Nosepin: "Nosepin",
    "Rings Premium": "Ring",
    Watches: "Watch",
  },
};

function pick(arr, i) {
  return arr[i % arr.length];
}

function generateProductName(categoryName, index) {
  const usePrefix = index % 2 === 0;
  const style = pick(NAME_PARTS.style, index);
  const suffix = NAME_PARTS.suffix[categoryName] || categoryName;
  if (usePrefix) {
    const prefix = pick(NAME_PARTS.prefix, Math.floor(index / 2));
    return `${prefix} ${suffix}`;
  }
  return `${style} ${suffix}`;
}

function priceForIndex(index) {
  // Skew toward the ₹199-599 band observed in the live filter counts.
  const bands = [149, 199, 249, 279, 299, 349, 399, 449, 499, 599, 699, 999];
  return pick(bands, index);
}

export async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || "admin@halajewels.in").toLowerCase();
  const existing = await AdminUser.findOne({ email });
  if (existing) return existing;
  const passwordHash = await AdminUser.hashPassword(process.env.ADMIN_PASSWORD || "Admin@123");
  const user = await AdminUser.create({
    name: "Super Admin",
    email,
    passwordHash,
    role: "superadmin",
  });
  console.log(`[seed] created admin user ${email} (password from ADMIN_PASSWORD env var)`);
  return user;
}

export async function runSeedIfEmpty() {
  await ensureAdminUser();

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    console.log("[seed] products already present, skipping catalog/content seed.");
    return;
  }

  console.log("[seed] seeding catalog and homepage content...");

  const categories = await Category.insertMany(
    CATEGORY_DEFS.map((c, i) => ({
      name: c.name,
      slug: slugify(c.name),
      image: c.image,
      sortOrder: i,
    }))
  );

  const tags = await Tag.insertMany(TAG_DEFS.map((t) => ({ name: t, slug: slugify(t) })));
  const tagByName = Object.fromEntries(tags.map((t) => [t.name, t]));

  const imagePool = productImagePool();
  const PRODUCTS_PER_CATEGORY = 10;
  let imgCursor = 0;
  const nextImages = (count) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      if (imagePool.length === 0) break;
      out.push(imagePool[imgCursor % imagePool.length]);
      imgCursor++;
    }
    return out;
  };

  const productsToInsert = [];
  categories.forEach((cat, catIdx) => {
    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
      const globalIdx = catIdx * PRODUCTS_PER_CATEGORY + i;
      const name = generateProductName(cat.name, i);
      const price = priceForIndex(globalIdx);
      const hasDiscount = globalIdx % 5 === 0;
      const discountPrice = hasDiscount ? Math.round(price * 0.8) : 0;
      const stock = 2 + (globalIdx % 15);
      // The real site always shows a 3-photo gallery per product (main swiper + thumbnail strip).
      const images = nextImages(3);

      const assignedTags = [];
      if (globalIdx % 4 === 0) assignedTags.push(tagByName["For Minimal Girlies"]._id);
      if (globalIdx % 6 === 0) assignedTags.push(tagByName["Silver Collections"]._id);
      if (price <= 199) assignedTags.push(tagByName["Under 199"]._id);
      if (globalIdx % 9 === 0) assignedTags.push(tagByName["Elegance in every drop"]._id);
      if (globalIdx % 11 === 0) assignedTags.push(tagByName["Soft. Sensual. Stunning."]._id);
      if (globalIdx % 7 === 0) assignedTags.push(tagByName["Luxe in Hala"]._id);

      productsToInsert.push({
        name,
        slug: `${slugify(name)}-${globalIdx}`,
        category: cat._id,
        tags: assignedTags,
        images: images.length ? images : [cat.image],
        specs: [
          "Premium alloy, tarnish-resistant plating",
          "Adjustable fit for everyday wear",
          "Lightweight and skin-friendly",
          "Ships in branded Hala Jewels packaging",
        ],
        description: `${name} from The Halla — monochrome elegance, designed for minimal girlies who love soft, sensual, stunning details.`,
        variants: [
          {
            label: hasDiscount ? "Standard" : "Rs.",
            price,
            discountPrice,
            stock,
            sku: `HJ-${cat.slug.slice(0, 3).toUpperCase()}-${globalIdx}`,
          },
        ],
        badge: globalIdx % 8 === 0 ? "NEW" : globalIdx % 13 === 0 ? "BESTSELLER" : "",
        isViral: false,
        isActive: true,
      });
    }
  });

  const inserted = await Product.insertMany(productsToInsert);

  // Mark the 3 "Virals You searching for" homepage picks + give them their real scraped photos/names.
  const viralPicks = [
    { name: "Viral Tulip Bracelet", image: "img_6a00a54bbe4d76.52276595.webp", categoryName: "Bracelets" },
    { name: "Pink Tulip Anklet", image: "img_6a047d91a31e70.64882507.webp", categoryName: "Anklets" },
    { name: "Lavender-Pink Tulip Anklet", image: "img_6a047e4ff0d401.76296489.webp", categoryName: "Anklets" },
  ];
  for (const pick of viralPicks) {
    const cat = categories.find((c) => c.name === pick.categoryName);
    await Product.create({
      name: pick.name,
      slug: slugify(pick.name),
      category: cat._id,
      images: [`${RAW}/${pick.image}`, ...nextImages(2)],
      specs: ["Premium alloy, tarnish-resistant plating", "Trending pick loved by our community"],
      description: `${pick.name} — one of our most-loved viral styles.`,
      variants: [{ label: "Rs.", price: 299, discountPrice: 0, stock: 12, sku: `HJ-VIRAL-${slugify(pick.name)}` }],
      badge: "NEW",
      isViral: true,
      isActive: true,
    });
  }

  // Homepage banners (hero handled separately in SiteSettings/Home component via first "hero" banner)
  await Banner.insertMany([
    { section: "hero", image: `${RAW}/69fcd1162afa1.jpg`, title: "Discover Our New Launches!", subtitle: "High quality — Long lasting — Perfect for every occasion", linkUrl: "/search", ctaLabel: "Shop Now", sortOrder: 0 },
    { section: "promo-large", image: `${RAW}/headings/heading_7_1778485605_6a01896513a67.webp`, title: "Luxe in Hala", linkUrl: "/search?tag=luxe-in-hala", ctaLabel: "Shop now", sortOrder: 0 },
    { section: "promo-small", image: `${RAW}/headings/heading_3_1778438634_6a00d1ea79e0c.webp`, title: "Silver Collections", linkUrl: "/search?tag=silver-collections", ctaLabel: "Shop now", sortOrder: 0 },
    { section: "promo-small", image: `${RAW}/headings/heading_4_1778485240_6a0187f87d3a8.webp`, title: "Under 199", linkUrl: "/search?tag=under-199", ctaLabel: "Shop now", sortOrder: 1 },
    { section: "mid-promo", image: `${RAW}/headings/heading_5_1778486032_6a018b10c59d4.webp`, title: "Elegance in every drop", linkUrl: "/search?tag=elegance-in-every-drop", ctaLabel: "Discover More", sortOrder: 0 },
    { section: "mid-promo", image: `${RAW}/headings/heading_6_1778485960_6a018ac84a941.webp`, title: "Soft. Sensual. Stunning.", linkUrl: "/search?tag=soft-sensual-stunning", ctaLabel: "Unlock Your Style", sortOrder: 1 },
    { section: "story", image: `${RAW}/6a00c2eb20b62.jpg`, title: "Slaying in the Style", sortOrder: 0 },
    { section: "story", image: `${RAW}/6a00c3b348e34.jpg`, title: "Slaying in the Style", sortOrder: 1 },
    { section: "story", image: `${RAW}/6a00c3cf7fdd6.jpg`, title: "Slaying in the Style", sortOrder: 2 },
  ]);

  await Testimonial.insertMany([
    { image: `${RAW}/69fcd33ece143.jpg`, sortOrder: 0 },
    { image: `${RAW}/69fcd37e59c27.jpg`, sortOrder: 1 },
    { image: `${RAW}/69fcd38dbb6ff.jpg`, sortOrder: 2 },
    { image: `${RAW}/69fcd3b4739d7.jpg`, sortOrder: 3 },
  ]);

  await Reel.insertMany([
    { embedUrl: "https://www.instagram.com/reel/DWq6BDjDF-v/embed", sortOrder: 0 },
  ]);

  await Page.insertMany([
    {
      slug: "about",
      title: "About Us",
      contentHtml:
        "<p>The Halla was born from a love of monochrome elegance — jewelry that feels soft, sensual and stunning without ever shouting for attention.</p><p>Every piece we design is meant for the minimal girlies: adjustable, tarnish-resistant, and priced so you can build a whole edit without a second thought. From anklets to handchains, we obsess over the small details so you don't have to.</p><p>Do connect, get accessorised.</p>",
    },
    {
      slug: "terms",
      title: "Terms & Conditions",
      contentHtml:
        "<p>By using this website you agree to our terms of use. All product images are representative; slight variation in shade or finish may occur due to photography and screen settings.</p><p>Prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify pricing, availability, and these terms at any time.</p>",
    },
    {
      slug: "shipping",
      title: "Shipping Policy",
      contentHtml:
        "<p>Orders are processed within 1-2 business days and shipped via trusted courier partners. Delivery typically takes 3-7 business days depending on your location.</p><p>You will receive tracking details once your order ships — use the Track Order page to check status any time.</p>",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      contentHtml:
        "<p>We collect only the information necessary to process your order — name, phone, address, and email. We never sell your data to third parties.</p><p>Order details are shared with our delivery partners solely for fulfilment purposes.</p>",
    },
  ]);

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        siteName: "The Halla",
        tagline: "DO CONNECT GET ACCESSORISED",
        offerBarText: "DO CONNECT GET ACCESSORISED",
        offerBarEnabled: true,
        whatsappNumber: "910000000000",
        contactPhone: "+91 00000 00000",
        contactEmail: "hello@halajewels.in",
        address: "Ground Floor, Example Building, Near Old Bus Stand, Calicut, Kerala",
        socialLinks: {
          instagram: "https://instagram.com/halajewells",
          facebook: "https://facebook.com/",
          youtube: "https://youtube.com/",
        },
      },
    },
    { upsert: true }
  );

  console.log(`[seed] inserted ${inserted.length + viralPicks.length} products across ${categories.length} categories.`);
}
