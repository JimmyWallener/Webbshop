import { Order, OrderInterface } from '@models/order.model';

export class OrderService {
  // Create a new order
  async createOrder(orderData: OrderInterface): Promise<Order> {
    try {
      const newOrder = await Order.create(orderData);
      return newOrder;
    } catch (error) {
      throw new Error('Error creating order');
    }
  }

  // Get all orders
  async getOrders(): Promise<Order[]> {
    try {
      return await Order.findAll();
    } catch (error) {
      throw new Error('Error fetching orders');
    }
  }

  // Get a single order by ID
  async getOrderById(id: number): Promise<Order | null> {
    try {
      return await Order.findById(id);
    } catch (error) {
      throw new Error('Error fetching order');
    }
  }

  // Update an order
  async updateOrder(
    id: number,
    orderData: OrderInterface
  ): Promise<Order | null> {
    try {
      const updatedOrder = await Order.updateById(id, orderData);
      return updatedOrder;
    } catch (error) {
      throw new Error('Error updating order');
    }
  }

  // Delete an order
  async deleteOrder(id: number): Promise<boolean> {
    try {
      return await Order.deleteById(id);
    } catch (error) {
      throw new Error('Error deleting order');
    }
  }
}
