import { Router } from "express";
import * as ctrl from "../controllers/publicController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/categories", asyncHandler(ctrl.getCategories));
router.get("/tags", asyncHandler(ctrl.getTags));
router.get("/homepage", asyncHandler(ctrl.getHomepage));
router.get("/settings", asyncHandler(ctrl.getSettings));
router.get("/pages/:slug", asyncHandler(ctrl.getPage));

router.get("/products", asyncHandler(ctrl.getProducts));
router.get("/products/:slug", asyncHandler(ctrl.getProductBySlug));

router.post("/orders", asyncHandler(ctrl.createOrder));
router.get("/orders/track", asyncHandler(ctrl.trackOrder));

router.post("/inquiries", asyncHandler(ctrl.submitInquiry));

export default router;
