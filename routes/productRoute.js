import express from 'express';
import {listProducts, addProduct, deleteProduct, putProduct, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Ajouter un produit
router.post('/', addProduct);

// Tous les produits
router.get('/', listProducts);

// Récupere un produit par ID
router.get('/:id', getProductById);

// Supprime un produit par ID
router.delete('/:id', deleteProduct);

// Modifi un produit par ID
router.put('/:id', putProduct);

export default router;
