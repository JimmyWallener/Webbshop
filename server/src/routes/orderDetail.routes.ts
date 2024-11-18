import { OrderDetailController } from '@controllers/summary.controller';
import express from 'express';

const router = express.Router();
const controller = new OrderDetailController();

router.post('/', (req, res) => controller.createOrderDetail(req, res));
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:orderId', (req, res) => controller.findOneByOrderId(req, res));
router.put('/:id', (req, res) => controller.updateOrderDetail(req, res));
router.delete('/:id', (req, res) => controller.deleteOrderDetail(req, res));

export default router;
