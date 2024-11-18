import { OrderDetailService } from '@services/details.service'; // Import the service
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schema for order detail data
const OrderDetailSchema = z.object({
  orderId: z.number().positive(),
  productId: z.number().positive(),
  quantity: z.number().positive(),
});

export class OrderDetailController {
  private orderDetailService: OrderDetailService;

  constructor() {
    this.orderDetailService = new OrderDetailService(); // Instantiate the service
  }

  // Create a new order detail
  async createOrderDetail(req: Request, res: Response): Promise<void> {
    const parsedData = OrderDetailSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const newOrderDetail = await this.orderDetailService.createOrderDetail(
        parsedData.data
      );
      res.status(201).json(newOrderDetail.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error creating order detail',
        error: (error as Error).message,
      });
    }
  }

  // Get all order details
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const orderDetails = await this.orderDetailService.findAll();
      res.status(200).json(orderDetails.map((detail) => detail.toJson()));
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching order details',
        error: (error as Error).message,
      });
    }
  }

  // Get order details by orderId
  async findOneByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const orderDetails = await this.orderDetailService.findOneByOrderId(
        Number(orderId)
      );
      if (orderDetails.length === 0) {
        res.status(404).json({ message: 'No order details found' });
        return;
      }
      res.status(200).json(orderDetails.map((detail) => detail.toJson()));
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching order details',
        error: (error as Error).message,
      });
    }
  }

  // Update an order detail
  async updateOrderDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const parsedData = OrderDetailSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ errors: parsedData.error.errors });
      return;
    }

    try {
      const updatedOrderDetail =
        await this.orderDetailService.updateOrderDetail(
          Number(id),
          parsedData.data
        );
      if (!updatedOrderDetail) {
        res.status(404).json({ message: 'Order detail not found' });
        return;
      }
      res.status(200).json(updatedOrderDetail.toJson());
    } catch (error) {
      res.status(500).json({
        message: 'Error updating order detail',
        error: (error as Error).message,
      });
    }
  }

  // Delete an order detail by ID
  async deleteOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.orderDetailService.deleteOrderDetail(
        Number(id)
      );
      if (!success) {
        res.status(404).json({ message: 'Order detail not found' });
        return;
      }
      res.status(200).json({ message: 'Order detail deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting order detail',
        error: (error as Error).message,
      });
    }
  }
}
