import express from "express";
import dotenv from "dotenv";

// routes
import orderRoutes from "./routes/orderRoute.js";

// middlewares (mock pour le moment)
import { authMiddleware } from "./middlewares/auth.js";

dotenv.config();
const app = express();

// Middleware pour parser JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API Orders en marche !");
});

// Routes protégées par authMiddleware
app.use("/orders", authMiddleware, orderRoutes);

// Gestion des erreurs (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Une erreur est survenue !" });
});

const PORT = process.env.PORT || 5000  ;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});




export default app;
