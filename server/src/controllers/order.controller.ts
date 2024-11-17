import { OrderService } from '@services/order.service';
import { Request, Response } from 'express';
import { z } from 'zod';

// Define schema for order validation
const OrderSchema = z.object({
  productId: z
    .number()
    .min(1, { message: 'Product ID must be a positive integer' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
});

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService(); // Instantiate the service
  }

  // Create a new order
  async createOrder(req: Request, res: Response): Promise<void> {
    const parsedData = OrderSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const { productId, quantity } = parsedData.data;
      const createdAt = new Date();

      const newOrder = await this.orderService.createOrder({
        productId,
        quantity,
        createdAt,
      });
      res.status(201).json(newOrder.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error creating order',
        error: (error as Error).message,
      });
    }
  }

  // Get all orders
  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getOrders();
      res.status(200).json(orders.map((order) => order.toJson()));
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching orders',
        error: (error as Error).message,
      });
    }
  }

  // Get a single order by ID
  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(Number(id));
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(order.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching order',
        error: (error as Error).message,
      });
    }
  }

  // Update an order
  async updateOrder(req: Request, res: Response): Promise<void> {
    const parsedData = OrderSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const { id } = req.params;
      const success = await this.orderService.updateOrder(Number(id), {
        ...parsedData.data,
        createdAt: new Date(),
      });
      if (!success) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating order',
        error: (error as Error).message,
      });
    }
  }

  // Delete an order
  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.orderService.deleteOrder(Number(id));
      if (!success) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting order',
        error: (error as Error).message,
      });
    }
  }
}
