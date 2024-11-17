import { ProductService } from '@services/product.service'; // Import the service
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schema for product data
const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  articleNumber: z.string().min(1, { message: 'Article number is required' }),
  price: z.number().positive({ message: 'Price must be greater than 0' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService(); // Instantiate the service
  }

  // Create a new product
  async createProduct(req: Request, res: Response): Promise<void> {
    const parsedData = ProductSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const newProduct = await this.productService.createProduct(
        parsedData.data
      );
      res.status(201).json(newProduct.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error creating product',
        error: (error as Error).message,
      });
    }
  }

  // Get all products
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getProducts();
      res.status(200).json(products.map((product) => product.toJson()));
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching products',
        error: (error as Error).message,
      });
    }
  }

  // Get a single product by ID
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(Number(id));
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json(product.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching product',
        error: (error as Error).message,
      });
    }
  }

  // Update a product
  async updateProduct(req: Request, res: Response): Promise<void> {
    const parsedData = ProductSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const { id } = req.params;
      const success = await this.productService.updateProduct(
        Number(id),
        parsedData.data
      );
      if (!success) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating product',
        error: (error as Error).message,
      });
    }
  }

  // Delete a product
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.productService.deleteProduct(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting product',
        error: (error as Error).message,
      });
    }
  }
}
