import db_sql from "../config/db.js";

// Créer une image pour un produit
export const createProductImage = (product_id, url, alt_text, is_primary = 0) => {
  return db_sql.query(
    "INSERT INTO product_images (product_id, url, alt_text, is_primary) VALUES (?, ?, ?, ?)",
    [product_id, url, alt_text, is_primary]
  );
};

// Récupérer toutes les images d’un produit

export const getAllProductImages = (product_id) => {
  return db_sql.query(
    "SELECT * FROM product_images WHERE product_id = ?",
    [product_id]
  );
};

// Récupérer l’image d’un produit par son ID
export const getProductImageById = (id) => {
  return db_sql.query(
    "SELECT * FROM product_images WHERE id = ?",
    [id]
  );
};

// Modifier une image
export const updateProductImage = (id, url, alt_text, is_primary) => {
  return db_sql.query(
    "UPDATE product_images SET url = ?, alt_text = ?, is_primary = ? WHERE id = ?",
    [url, alt_text, is_primary, id]
  );
};

// Supprimer une image
export const deleteProductImage = (id) => {
  return db_sql.query(
    "DELETE FROM product_images WHERE id = ?",
    [id]
  );
};