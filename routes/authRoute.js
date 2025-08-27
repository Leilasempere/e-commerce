import { Router } from "express";
import { register, verifyEmail, login, logout, forgotPassword, resetPassword } from "../controllers/authController.js";
import limiter from "../utils/limiter.js";


const router = Router();

router.post("/register", limiter, register);
router.get("/verify/:token", verifyEmail);


router.post("/login", limiter, login);
router.post("/logout", logout);

router.post("/forgot-password", limiter, forgotPassword);
router.post("/reset-password/:token", limiter, resetPassword);



export default router;
