import { Router } from "express";
import { requireAdmin, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { crudFactory } from "../controllers/crudFactory.js";

import Category from "../models/Category.js";
import Tag from "../models/Tag.js";
import Banner from "../models/Banner.js";
import Testimonial from "../models/Testimonial.js";
import Reel from "../models/Reel.js";

import * as auth from "../controllers/adminAuthController.js";
import * as admin from "../controllers/adminController.js";

const router = Router();

// Auth (public within /admin scope)
router.post("/auth/login", asyncHandler(auth.login));
router.get("/auth/me", requireAdmin, asyncHandler(auth.me));

// Everything below requires a valid admin session
router.use(requireAdmin);

router.get("/dashboard", asyncHandler(admin.dashboardStats));
router.post("/upload", upload.single("image"), asyncHandler(admin.uploadImage));

// Products (custom controller for slug handling)
router.get("/products", asyncHandler(admin.listProducts));
router.get("/products/:id", asyncHandler(admin.getProduct));
router.post("/products", asyncHandler(admin.createProduct));
router.put("/products/:id", asyncHandler(admin.updateProduct));
router.delete("/products/:id", asyncHandler(admin.deleteProduct));

// Categories (slug handling + generic list/get/delete)
const categoryCrud = crudFactory(Category, { searchFields: ["name"], defaultSort: { sortOrder: 1 } });
router.get("/categories", categoryCrud.list);
router.get("/categories/:id", categoryCrud.get);
router.post("/categories", asyncHandler(admin.createCategory));
router.put("/categories/:id", asyncHandler(admin.updateCategory));
router.delete("/categories/:id", categoryCrud.remove);

// Tags
const tagCrud = crudFactory(Tag, { searchFields: ["name"] });
router.get("/tags", tagCrud.list);
router.post("/tags", tagCrud.create);
router.put("/tags/:id", tagCrud.update);
router.delete("/tags/:id", tagCrud.remove);

// Banners
const bannerCrud = crudFactory(Banner, { defaultSort: { sortOrder: 1 } });
router.get("/banners", bannerCrud.list);
router.post("/banners", bannerCrud.create);
router.put("/banners/:id", bannerCrud.update);
router.delete("/banners/:id", bannerCrud.remove);

// Testimonials
const testimonialCrud = crudFactory(Testimonial, { defaultSort: { sortOrder: 1 } });
router.get("/testimonials", testimonialCrud.list);
router.post("/testimonials", testimonialCrud.create);
router.put("/testimonials/:id", testimonialCrud.update);
router.delete("/testimonials/:id", testimonialCrud.remove);

// Reels
const reelCrud = crudFactory(Reel, { defaultSort: { sortOrder: 1 } });
router.get("/reels", reelCrud.list);
router.post("/reels", reelCrud.create);
router.put("/reels/:id", reelCrud.update);
router.delete("/reels/:id", reelCrud.remove);

// Pages (About/Terms/Shipping/Privacy)
router.get("/pages", asyncHandler(admin.listPages));
router.put("/pages/:slug", asyncHandler(admin.upsertPage));

// Settings
router.get("/settings", asyncHandler(admin.getSettingsAdmin));
router.put("/settings", asyncHandler(admin.updateSettings));

// Orders
router.get("/orders", asyncHandler(admin.listOrders));
router.put("/orders/:id/status", asyncHandler(admin.updateOrderStatus));

// Inquiries
router.get("/inquiries", asyncHandler(admin.listInquiries));
router.put("/inquiries/:id", asyncHandler(admin.updateInquiry));

// Admin users (superadmin only for create/delete)
router.get("/users", asyncHandler(admin.listAdminUsers));
router.post("/users", requireRole("superadmin"), asyncHandler(admin.createAdminUser));
router.put("/users/:id", asyncHandler(admin.updateAdminUser));
router.delete("/users/:id", requireRole("superadmin"), asyncHandler(admin.deleteAdminUser));

export default router;
