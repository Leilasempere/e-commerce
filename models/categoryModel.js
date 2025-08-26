import db_sql from "../config/db";

// Créer une categorie

export const createCategorie = (nom) => {
    return db_sql.query(
      "INSERT INTO categories (nom) VALUES (?)",
      [nom]
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

export const updateCategorie = (id, nom) => {
    return db_sql.query(
      "UPDATE categories SET nom=?, WHERE id=?",
      [nom,id]
    );
  };

// Supprimer une categorie 

  export const deleteCategorie = (id) => {
    return db_sql.query("DELETE FROM categories WHERE id = ?", [id]);
  };