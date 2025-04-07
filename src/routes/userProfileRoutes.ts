import { Router } from "express";
import { UserProfileController } from "../controllers";
import { requireAuth } from "../middleware";

const router = Router();

router.post("/user", requireAuth, UserProfileController.profileUpdate);

export default router;
