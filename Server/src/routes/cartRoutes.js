import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as ctrl from "../controllers/cartController.js";

const router = Router();

router.use(requireUser);
router.get("/", asyncHandler(ctrl.getCart));
router.put("/", asyncHandler(ctrl.saveCart));

export default router;
