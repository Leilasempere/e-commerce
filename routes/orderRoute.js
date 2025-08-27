import express from "express";
import { orderController}  from "../controllers/orderController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();


router.post('/', orderController.createOrder);  


router.get('/:order_id', orderController.getOrderById);


router.get('/', orderController.getAllOrders);


router.put('/:order_id/status', isAdmin,orderController.updateStatus);


router.delete('/:order_id',isAdmin, orderController.deleteOrder);

export default router;