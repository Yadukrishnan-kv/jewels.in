import { Router } from "express";
import * as ctrl from "../controllers/publicController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireUser } from "../middleware/auth.js";

const router = Router();

router.get("/categories", asyncHandler(ctrl.getCategories));
router.get("/tags", asyncHandler(ctrl.getTags));
router.get("/homepage", asyncHandler(ctrl.getHomepage));
router.get("/settings", asyncHandler(ctrl.getSettings));
router.get("/pages/:slug", asyncHandler(ctrl.getPage));

router.get("/products", asyncHandler(ctrl.getProducts));
router.get("/products/:slug", asyncHandler(ctrl.getProductBySlug));

router.post("/orders", requireUser, asyncHandler(ctrl.createOrder));
router.get("/orders/mine", requireUser, asyncHandler(ctrl.myOrders));
router.get("/orders/track", asyncHandler(ctrl.trackOrder));

router.post("/inquiries", asyncHandler(ctrl.submitInquiry));

export default router;
