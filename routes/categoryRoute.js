import express, { Router } from 'express'
import { listCategories, addCategorie, deleteCategorie, putCategorie, getCategorieById } from '../controllers/categoryController.js'

const router = express.Router()

//Ajouter
router.post('/' , addCategorie)

//Toutes les categories
router.get('/' , listCategories)

//Trouve categorie par son id
router.get('/:id', getCategorieById)

//Modifie une categorie par son id 
router.put('/:id', putCategorie)

//SUpprime une categorie par son id
router.delete('/:id', deleteCategorie)

export default router;