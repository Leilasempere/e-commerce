import pool from '../config/db.js';

export const Order = {

    // creation d'une commande
    createOrder : async (buyer_id, shipping_address_id, total_amount) => {
        try {
            const sql = 'INSERT INTO orders (buyer_id, shipping_address_id, total_amount) VALUES (?, ?, ?)';
            const [result] = await pool.execute(sql, [buyer_id, shipping_address_id, total_amount]);
        return result.insertId; 
    } catch (error) {
        throw error;
    }
},
    // recupere une commande par son id
    findOrderById : async (order_id) => {
        try {
            const sql = 'SELECT * FROM orders WHERE id = ?';
            const [rows] = await pool.execute(sql, [order_id]);
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    },

    // Admin recupère toutes les commandes
    getAllOrders: async () => {
    const sql = 'SELECT * FROM orders';
    const [rows] = await pool.execute(sql);
    return rows;
},

    // acheteur ne voit que ses commandes
    getAllOrdersByBuyer: async (buyer_id) => {
    const sql = 'SELECT * FROM orders WHERE buyer_id = ?';
    const [rows] = await pool.execute(sql, [buyer_id]);
    return rows;
},

    // mise a jour du satut
    updateStatus : async (order_id, status) => {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [status, order_id]);
    return result.affectedRows; // lignes affectées
},


    // suppression d'une commande
    deleteOrder : async (order_id) => {
        try {
            const sql = 'DELETE FROM orders WHERE id = ?';
            const [result] = await pool.execute(sql, [order_id]);
            return result.affectedRows; 
        } catch (error) {
            throw error;
        }
    }
};

    






