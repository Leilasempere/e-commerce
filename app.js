import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Liste des imports 
import categoriesRoutes from './routes/categoryRoute.js'
import productsRoutes from './routes/productRoute.js';
import productImagesRoutes from './routes/productImagesRoute.js';


const app = express()
const PORT = process.env.PORT || 5002;

// Un Middleware pour parser les crops des requêtes HTTP au format JSON (comme body-parser)
app.use(express.json());

// Middleware pour parser les données de formulaire (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));


// Routes d'accueil 


// Routes API 
app.use('/categories', categoriesRoutes);
app.use('/produits', productsRoutes);
app.use('/produit-images', productImagesRoutes);


// Démarage du serveur 
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
})