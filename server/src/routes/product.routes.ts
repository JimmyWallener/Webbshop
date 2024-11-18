import { ProductController } from '@controllers/product.controller';
import express from 'express';

const router = express.Router();
const controller = new ProductController();

router.post('/', (req, res) => controller.createProduct(req, res));
router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findOneById(req, res));
router.put('/:id', (req, res) => controller.updateProduct(req, res));
router.delete('/:id', (req, res) => controller.deleteProduct(req, res));

export default router;
