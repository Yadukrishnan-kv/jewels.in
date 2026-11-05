import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as ctrl from "../controllers/wishlistController.js";

const router = Router();

router.use(requireUser);
router.get("/", asyncHandler(ctrl.getWishlist));
router.put("/", asyncHandler(ctrl.saveWishlist));

export default router;
