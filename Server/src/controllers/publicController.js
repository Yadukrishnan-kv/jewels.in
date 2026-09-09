import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Tag from "../models/Tag.js";
import Banner from "../models/Banner.js";
import Testimonial from "../models/Testimonial.js";
import Reel from "../models/Reel.js";
import Page from "../models/Page.js";
import SiteSettings from "../models/SiteSettings.js";
import Order from "../models/Order.js";
import Inquiry from "../models/Inquiry.js";
import { generateOrderNumber } from "../utils/slugify.js";

function productPrice(p) {
  const prices = p.variants.map((v) => v.discountPrice || v.price);
  return Math.min(...prices);
}
function productOriginal(p) {
  const withDiscount = p.variants.find((v) => v.discountPrice > 0);
  return withDiscount ? withDiscount.price : null;
}

export function serializeProductCard(p) {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    image: p.images?.[0] || "",
    price: productPrice(p),
    originalPrice: productOriginal(p),
    badge: p.badge,
    category: p.category,
  };
}

export async function getCategories(req, res) {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  res.json(categories);
}

export async function getTags(req, res) {
  const tags = await Tag.find().sort({ name: 1 });
  res.json(tags);
}

export async function getHomepage(req, res) {
  const [categories, banners, testimonials, reels, viralProducts, settings] = await Promise.all([
    Category.find({ isActive: true, showOnHome: true }).sort({ sortOrder: 1 }),
    Banner.find({ isActive: true }).sort({ sortOrder: 1 }),
    Testimonial.find({ isActive: true }).sort({ sortOrder: 1 }),
    Reel.find({ isActive: true }).sort({ sortOrder: 1 }),
    Product.find({ isActive: true, isViral: true }).populate("category", "name slug").limit(8),
    SiteSettings.findOne({ key: "main" }),
  ]);

  const minimalGirlies = await Product.find({ isActive: true })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({
    categories,
    banners,
    testimonials,
    reels,
    viralProducts: viralProducts.map(serializeProductCard),
    minimalGirlies: minimalGirlies.map(serializeProductCard),
    settings,
  });
}

export async function getSettings(req, res) {
  const settings = await SiteSettings.findOne({ key: "main" });
  res.json(settings);
}

export async function getPage(req, res) {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: "Page not found" });
  res.json(page);
}

const SORTS = {
  featured: { createdAt: -1 },
  "price-low-high": null,
  "price-high-low": null,
  newest: { createdAt: -1 },
};

export async function getProducts(req, res) {
  const { category, tag, search, sort = "featured", price_min, price_max, discount, page = 1 } = req.query;

  const filter = { isActive: true };
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
    else filter.category = null; // no match
  }
  if (tag) {
    const tagDoc = await Tag.findOne({ slug: tag });
    if (tagDoc) filter.tags = tagDoc._id;
  }
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  let products = await Product.find(filter).populate("category", "name slug");

  if (price_min || price_max) {
    const min = Number(price_min) || 0;
    const max = price_max ? Number(price_max) : Infinity;
    products = products.filter((p) => {
      const price = productPrice(p);
      return price >= min && price <= max;
    });
  }

  if (discount) {
    const minPct = Number(discount);
    products = products.filter((p) =>
      p.variants.some((v) => v.discountPrice > 0 && ((v.price - v.discountPrice) / v.price) * 100 >= minPct)
    );
  }

  if (sort === "price-low-high") products.sort((a, b) => productPrice(a) - productPrice(b));
  else if (sort === "price-high-low") products.sort((a, b) => productPrice(b) - productPrice(a));
  else products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const PAGE_SIZE = 24;
  const pageNum = Math.max(1, Number(page) || 1);
  const total = products.length;
  const paged = products.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE);

  // price bucket counts for filter sidebar (based on category/search/tag filtered set, ignoring price filter itself)
  let baseForCounts = await Product.find({ ...filter }).select("variants");
  const buckets = [
    { key: "0-100", min: 0, max: 100 },
    { key: "101-200", min: 101, max: 200 },
    { key: "201-300", min: 201, max: 300 },
    { key: "301-400", min: 301, max: 400 },
    { key: "401-500", min: 401, max: 500 },
    { key: "501-max", min: 501, max: Infinity },
  ];
  const priceCounts = Object.fromEntries(
    buckets.map((b) => [
      b.key,
      baseForCounts.filter((p) => {
        const price = productPrice(p);
        return price >= b.min && price <= b.max;
      }).length,
    ])
  );

  res.json({
    products: paged.map(serializeProductCard),
    total,
    page: pageNum,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    priceCounts,
  });
}

export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate("category", "name slug");
  if (!product) return res.status(404).json({ message: "Product not found" });

  const related = await Product.find({
    category: product.category?._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(8)
    .populate("category", "name slug");

  res.json({
    product: {
      ...product.toJSON(),
      minPrice: productPrice(product),
    },
    related: related.map(serializeProductCard),
  });
}

export async function createOrder(req, res) {
  const { customer, items } = req.body;
  if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city || !customer?.pincode) {
    return res.status(400).json({ message: "Missing required customer details" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer,
    items,
    subtotal,
    total: subtotal,
  });

  const settings = await SiteSettings.findOne({ key: "main" });

  res.status(201).json({ order, whatsappNumber: settings?.whatsappNumber || "919999999999" });
}

export async function trackOrder(req, res) {
  const { orderNumber, phone } = req.query;
  if (!orderNumber || !phone) return res.status(400).json({ message: "Order number and phone are required" });

  const order = await Order.findOne({ orderNumber: orderNumber.trim(), "customer.phone": phone.trim() });
  if (!order) return res.status(404).json({ message: "No order found with that number and phone" });

  res.json(order);
}

export async function submitInquiry(req, res) {
  const { name, phone, email, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: "Name and message are required" });
  const inquiry = await Inquiry.create({ name, phone, email, message });
  res.status(201).json(inquiry);
}
