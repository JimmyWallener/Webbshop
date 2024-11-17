import { OrderDetailController } from '@controllers/summary.controller';
import express from 'express';

const router = express.Router();
const controller = new OrderDetailController();

router.post('/', (req, res) => controller.createOrderDetail(req, res));
router.get('/', (req, res) => controller.getOrderDetails(req, res));
router.get('/:orderId', (req, res) =>
  controller.getOrderDetailsByOrderId(req, res)
);
router.delete('/:id', (req, res) => controller.deleteOrderDetail(req, res));

export default router;
