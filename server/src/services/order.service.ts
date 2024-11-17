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
      const orders = await Order.findAll();
      return orders;
    } catch (error) {
      throw new Error('Error fetching orders');
    }
  }

  // Get a single order by ID
  async getOrderById(id: number): Promise<Order | null> {
    try {
      const order = await Order.findById(id);
      return order;
    } catch (error) {
      throw new Error('Error fetching order');
    }
  }

  // Update an order
  async updateOrder(id: number, updatedData: OrderInterface): Promise<boolean> {
    try {
      const success = await Order.update(id, updatedData);
      return success;
    } catch (error) {
      throw new Error('Error updating order');
    }
  }

  // Delete an order
  async deleteOrder(id: number): Promise<boolean> {
    try {
      const success = await Order.deleteById(id);
      return success;
    } catch (error) {
      throw new Error('Error deleting order');
    }
  }
}
