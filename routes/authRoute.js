import { Router } from "express";
import { register, verifyEmail, login, logout, forgotPassword, resetPassword } from "../controllers/authController.js";
import { validate } from "../middlewares/joiValidationMiddleware.js";
import { registerSchema, loginSchema, forgotSchema, resetSchema } from "../middlewares/joiSchemaMiddleware.js";
import limiter from "../middlewares/limiterMiddleware.js";
import { uploadLogo, setLogoUrlFromFile } from "../middlewares/cloudinaryLogoMiddleware.js";
const router = Router();

router.post("/register", limiter,  uploadLogo, setLogoUrlFromFile, validate(registerSchema), register);
router.get("/verify/:token", verifyEmail);


router.post("/login", limiter, validate(loginSchema), login);
router.post("/logout", logout);

router.post("/forgot-password", limiter, validate(forgotSchema), forgotPassword);
router.post("/reset-password/:token", limiter, validate(resetSchema), resetPassword);



export default router;
