import * as Products from '../models/productModel.js';

// Créer un produit

export async function addProduct(req, res) {
    const { seller_id, category_id, name, description, price, stock } = req.body;
    try {
        await Products.createProduct(seller_id, category_id, name, description, price, stock);
        res.status(201).send('Produit créé avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

// Liste toutes les produits

export async function listProducts(req, res) {
    try {
        const [products] = await Products.getAllProducts()
        //res.render(`Products`, {products}) // Pour montrer dans un vue en HTML
        res.status(200).json(products) // Pour montrer dans un API, sur Postman
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreur de serveur')
    }
}

// Recuperer un produit par son id 

export async function getProductById(req, res) {
    const { id } = req.params
    try {
        const [rows] = await Products.getProductById(id)
        if (!rows.length) return res.status(404).json({ error: "Produit non trouvé" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
}

// Modifie un produit

export async function putProduct(req, res) {
    const { id } = req.params;
    const { seller_id, category_id, name, description, price, stock } = req.body;
    try {
        await Products.updateProduct(id, seller_id, category_id, name, description, price, stock);
        res.status(200).send('Produit modifié avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

// Supprime un produit

export async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        await Products.deleteProduct(id);

        res.status(200).send('Produit supprimé avec succès')
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur')
    }
}