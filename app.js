import express from "express";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoute.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import limiter from "./middlewares/limiterMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import categoriesRoutes from './routes/categoryRoute.js'
import productsRoutes from './routes/productRoute.js';
import productImagesRoutes from './routes/productImagesRoute.js';
import { verifyToken, generateToken, isAdmin, isSeller,isBuyer } from "./middlewares/authMiddleware.js";


dotenv.config();
const app = express();

// Middleware pour parser JSON
app.use(express.json());
app.use(cookieParser()); 
app.use(cors());
app.use(limiter);

// Middleware pour parser les données de formulaire (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));


// Test route
app.get("/", (req, res) => {
  res.send("API Orders en marche !");
});

// Routes protégées par authMiddleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders",verifyToken, generateToken, isAdmin, isSeller, isBuyer, orderRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/produits', productsRoutes);
app.use('/api/produit-images', productImagesRoutes);



// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Une erreur est survenue !" });
});

const PORT = process.env.PORT || 5000  ;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});




export default app;
