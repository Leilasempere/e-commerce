import { Router } from "express";
import { getAllUsersController, getUserByIdController, updateMe, deleteUserController, protectedExample } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Exemple de route protégée
router.get("/protected/example", verifyToken, protectedExample);

router.get("/", verifyToken, isAdmin, getAllUsersController); // admin uniquement
router.get("/:id", verifyToken, getUserByIdController);

// Routes protégées
router.put("/me", verifyToken, updateMe); // l'utilisateur connecté met à jour son profil
router.delete("/:id", verifyToken, isAdmin, deleteUserController); // admin supprime un user



export default router;
