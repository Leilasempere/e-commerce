import express from 'express';
import { listProductImages, addProductImage, deleteProductImage, PutProductImage, getProductImageById } from '../controllers/productImagesController.js';

const router = express.Router();

// Ajoute une image pour un produit
router.post('/', addProductImage);

// Toutes les images d’un produit
router.get('/product/:product_id', listProductImages); // Attention a mettre le /ID du produit parent pour avoir accé aux images enfants.

// Récupere une image par ID
router.get('/:id', getProductImageById);

// Supprime une image par ID
router.delete('/:id', deleteProductImage);

// Modifi une image par ID
router.put('/:id', PutProductImage);

export default router;
