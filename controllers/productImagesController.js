import * as ProductImages from "../models/productImagesModel.js";

// Créer une image pour un produit
export async function addProductImage(req, res) {
  const { product_id, url, alt_text, is_primary } = req.body;
  try {
    await ProductImages.createProductImage(product_id, url, alt_text, is_primary || 0);
    res.status(201).send("Image créée avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}

// Liste toutes les images d’un produit
export async function listProductImages(req, res) {
    const { product_id } = req.params;
    try {
        const [images] = await ProductImages.getAllProductImages(product_id);
         //res.render('ProductImages', { images }); // Pour afficher dans une vue HTML
        res.status(200).json(images);  // Pour une API JSON, sur POSTMAN
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

// Récupérer une image par son ID
export async function getProductImageById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await ProductImages.getProductImageById(id);
    if (!rows.length) return res.status(404).json({ error: "Image non trouvée" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}

// Modifier une image
export async function PutProductImage(req, res) {
  const { id } = req.params;
  const { url, alt_text, is_primary } = req.body;
  try {
    await ProductImages.updateProductImage(id, url, alt_text, is_primary || 0);
    res.status(200).send("Image modifiée avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}

// Supprimer une image
export async function deleteProductImage(req, res) {
  const { id } = req.params;
  try {
    await ProductImages.deleteProductImage(id);
    res.status(200).send("Image supprimée avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
}
