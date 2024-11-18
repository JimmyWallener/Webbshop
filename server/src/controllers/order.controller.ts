import { OrderService } from '@services/order.service';
import { Request, Response } from 'express';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  // Create a new order
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { createdAt } = req.body;
      const newOrder = await this.orderService.createOrder({ createdAt });
      res.status(201).json(newOrder.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error creating order',
        error: (error as Error).message,
      });
    }
  }

  // Get all orders
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.findAll();
      res.status(200).json(orders.map((order) => order.toJson()));
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching orders',
        error: (error as Error).message,
      });
    }
  }

  // Get a single order by ID
  async findOneById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.findOneById(Number(id));
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
    try {
      const { id } = req.params;
      const { createdAt } = req.body;
      const updatedOrder = await this.orderService.updateOrder(Number(id), {
        createdAt,
      });
      if (!updatedOrder) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(updatedOrder.toJson());
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
