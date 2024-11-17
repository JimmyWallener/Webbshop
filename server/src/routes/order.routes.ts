import { OrderController } from '@controllers/order.controller';
import express from 'express';

const router = express.Router();
const controller = new OrderController();

router.post('/', (req, res) => controller.createOrder(req, res));
router.get('/', (req, res) => controller.getOrders(req, res));
router.get('/:id', (req, res) => controller.getOrderById(req, res));
router.put('/:id', (req, res) => controller.updateOrder(req, res));
router.delete('/:id', (req, res) => controller.deleteOrder(req, res));

export default router;
