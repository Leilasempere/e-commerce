import {Order} from '../models/orderModel.js';

export const orderController = {

    // creation d'une commande
    createOrder: async (req, res) => {
        try {
            const { buyer_id, shipping_address_id, total_amount } = req.body;
            const orderId = await Order.createOrder(buyer_id, shipping_address_id, total_amount);
            res.status(201).json({ message: 'Commande créée avec succès', orderId });
        } catch (error) {
            res.status(500).json({ error: 'erreur à la création de la commande' });
        }
    },

    // recupere par son id
    getOrderById: async (req, res) => {
        try {
            const { order_id } = req.params;
            const order = await Order.findOrderById(order_id);
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ error: 'Commande non trouvée' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
        }
    },

    // recupere toutes les commandes, l'admin ttes les commandes, l'acheteur juste les siennes
    getAllOrders: async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.getAllOrders();
        } else {
            const buyer_id = req.user.id;
            orders = await Order.getAllOrdersByBuyer(buyer_id);
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
},

    // mise a jour du statut
    updateStatus: async (req, res) => {
        try {
            const { order_id } = req.params;
            const { status } = req.body;
        
            const validStatuses = ['pending','paid','shipped','delivered','cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Statut invalide. Valeurs autorisées: ${validStatuses.join(', ')}` });
        }
            const affectedRows = await Order.updateStatus(order_id, status);
            if (affectedRows > 0) {
                res.status(200).json({ message: 'Statut de la commande mis à jour avec succès' });
            } else {
                res.status(404).json({ error: 'Commande non trouvée' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la commande' });
        }
    },

    // suppression d'une commande
    deleteOrder: async (req, res) => {
        try {
            const { order_id } = req.params;
            const affectedRows = await Order.deleteOrder(order_id);
            if (affectedRows > 0) {
                res.status(200).json({ message: 'Commande supprimée avec succès' });
            } else {
                res.status(404).json({ error: 'Commande non trouvée' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
        }
    }
}