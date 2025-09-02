import db_sql from "../config/db.js";

// Créer une categorie

export const createCategorie = (name) => {
    return db_sql.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
  };

// Recuperer toutes les categories 

export const getAllCategories = () => {
  return db_sql.query("SELECT * FROM categories");
};

// Recuperer une categorie par son Id


  export const getCategorieById = (id) => {
    return db_sql.query("SELECT * FROM categories WHERE id = ?", [id]);
  };

// Modifier une categorie 

export const updateCategorie = (id, name) => {
    return db_sql.query(
      "UPDATE categories SET name=? WHERE id=?",
      [name,id]
    );
  };

// Supprimer une categorie 

  export const deleteCategorie = (id) => {
    return db_sql.query("DELETE FROM categories WHERE id = ?", [id]);
  };

