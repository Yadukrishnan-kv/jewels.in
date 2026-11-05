import { Router } from "express";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as auth from "../controllers/authController.js";

const router = Router();

router.post("/register", asyncHandler(auth.register));
router.post("/login", asyncHandler(auth.login));
router.get("/me", requireUser, asyncHandler(auth.me));

export default router;
