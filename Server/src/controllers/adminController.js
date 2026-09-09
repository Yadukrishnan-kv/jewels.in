import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Page from "../models/Page.js";
import SiteSettings from "../models/SiteSettings.js";
import AdminUser from "../models/AdminUser.js";
import Inquiry from "../models/Inquiry.js";
import { slugify } from "../utils/slugify.js";

async function uniqueSlug(base, Model, excludeId) {
  let slug = slugify(base);
  let n = 1;
  while (await Model.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}

// ---- Products ----
export async function listProducts(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };
  const products = await Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate("category", "name slug").populate("tags");
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
}

export async function createProduct(req, res) {
  const slug = await uniqueSlug(req.body.name, Product);
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const payload = { ...req.body };
  if (payload.name) {
    payload.slug = await uniqueSlug(payload.name, Product, req.params.id);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
}

// ---- Categories (slug handling wraps generic CRUD) ----
export async function createCategory(req, res) {
  const slug = await uniqueSlug(req.body.name, Category);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json(category);
}
export async function updateCategory(req, res) {
  const payload = { ...req.body };
  if (payload.name) payload.slug = await uniqueSlug(payload.name, Category, req.params.id);
  const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json(category);
}

// ---- Pages ----
export async function listPages(req, res) {
  res.json(await Page.find().sort({ title: 1 }));
}
export async function upsertPage(req, res) {
  const { slug } = req.params;
  const page = await Page.findOneAndUpdate(
    { slug },
    { $set: { title: req.body.title, contentHtml: req.body.contentHtml, slug } },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(page);
}

// ---- Settings (singleton) ----
export async function getSettingsAdmin(req, res) {
  let settings = await SiteSettings.findOne({ key: "main" });
  if (!settings) settings = await SiteSettings.create({ key: "main" });
  res.json(settings);
}
export async function updateSettings(req, res) {
  const settings = await SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(settings);
}

// ---- Orders ----
export async function listOrders(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
}
export async function updateOrderStatus(req, res) {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status, notes: req.body.notes ?? undefined } },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
}

// ---- Inquiries ----
export async function listInquiries(req, res) {
  res.json(await Inquiry.find().sort({ createdAt: -1 }));
}
export async function updateInquiry(req, res) {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true });
  if (!inquiry) return res.status(404).json({ message: "Not found" });
  res.json(inquiry);
}

// ---- Admin users ----
export async function listAdminUsers(req, res) {
  res.json(await AdminUser.find().select("-passwordHash").sort({ createdAt: -1 }));
}
export async function createAdminUser(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email, password are required" });
  const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  if (existing) return res.status(409).json({ message: "An admin with this email already exists" });
  const passwordHash = await AdminUser.hashPassword(password);
  const user = await AdminUser.create({ name, email: email.toLowerCase().trim(), passwordHash, role: role || "staff" });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
}
export async function updateAdminUser(req, res) {
  const payload = {};
  if (req.body.name) payload.name = req.body.name;
  if (req.body.role) payload.role = req.body.role;
  if (typeof req.body.isActive === "boolean") payload.isActive = req.body.isActive;
  if (req.body.password) payload.passwordHash = await AdminUser.hashPassword(req.body.password);

  if (req.adminUser.role !== "superadmin" && String(req.adminUser._id) !== req.params.id) {
    return res.status(403).json({ message: "Only a superadmin can edit other admins" });
  }

  const user = await AdminUser.findByIdAndUpdate(req.params.id, payload, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
}
export async function deleteAdminUser(req, res) {
  if (String(req.adminUser._id) === req.params.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }
  const user = await AdminUser.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
}

// ---- Dashboard ----
export async function dashboardStats(req, res) {
  const [productCount, categoryCount, orderCounts, recentOrders, revenueAgg] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  const ordersByStatus = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  orderCounts.forEach((o) => (ordersByStatus[o._id] = o.count));

  res.json({
    productCount,
    categoryCount,
    orderCount: Object.values(ordersByStatus).reduce((a, b) => a + b, 0),
    ordersByStatus,
    totalRevenue: revenueAgg[0]?.total || 0,
    recentOrders,
  });
}

// ---- Upload ----
export function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/media/${req.file.filename}` });
}
