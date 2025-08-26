import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Liste des imports 
import categoriesRoutes from './routes/categoryRoute.js'


const app = express()
const PORT = process.env.PORT || 5002;


// Routes d'accueil 


// Routes API 
app.use('/categories', categoriesRoutes);

// Démarage du serveur 
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur http://localhost:${PORT}`);
})