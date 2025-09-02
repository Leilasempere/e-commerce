import db_sql from "../config/db.js";

// Créer un produit 

export const createProduct = ( seller_id, category_id, name, description, price, stock ) => {
  return db_sql.query(
    "INSERT INTO products (seller_id, category_id, name, description, price, stock, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [seller_id, category_id, name, description, price, stock]
  );
};


// Récupérer tous les produits

export const getAllProducts = () => {
  return db_sql.query(
    "SELECT * FROM products"
  );
};

// Recuperer un produit par son Id

  export const getProductById = (id) => {
    return db_sql.query("SELECT * FROM products WHERE id = ?", [id]);
  };

// Modifier un produit

export const updateProduct = ( id, seller_id, category_id, name, description, price, stock ) => {
  return db_sql.query("UPDATE products SET seller_id=?, category_id=?, name=?, description=?, price=?, stock=? WHERE id=?",
    [seller_id, category_id, name, description, price, stock, id]
  );
};

// Supprimer un produit

 export const deleteProduct = (id) => {
    return db_sql.query("DELETE FROM products WHERE id = ?", [id]);
  };