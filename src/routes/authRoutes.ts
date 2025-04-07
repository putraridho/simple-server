import { Router } from "express";
import { AuthController } from "../controllers";

const router = Router();

router.post("/signup", AuthController.signupPost);

router.post("/login", AuthController.loginPost);

export default router;
