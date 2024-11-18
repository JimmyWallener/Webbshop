import { OrderDetail, OrderDetailInterface } from '@/models/detail.model';

export class OrderDetailService {
  // Create a new order detail
  async createOrderDetail(
    orderDetailData: OrderDetailInterface
  ): Promise<OrderDetail> {
    try {
      const newOrderDetail = await OrderDetail.create(orderDetailData);
      return newOrderDetail;
    } catch (error) {
      throw new Error('Error creating order detail');
    }
  }

  // Get all order details
  async getOrderDetails(): Promise<OrderDetail[]> {
    try {
      const orderDetails = await OrderDetail.findAll();
      return orderDetails;
    } catch (error) {
      throw new Error('Error fetching order details');
    }
  }

  // Get order details by orderId
  async getOrderDetailsByOrderId(orderId: number): Promise<OrderDetail[]> {
    try {
      const orderDetails = await OrderDetail.findByOrderId(orderId);
      return orderDetails;
    } catch (error) {
      throw new Error('Error fetching order details by orderId');
    }
  }

  // Update an order detail
  async updateOrderDetail(
    id: number,
    orderDetailData: OrderDetailInterface
  ): Promise<OrderDetail | null> {
    try {
      const updatedOrderDetail = await OrderDetail.updateById(
        id,
        orderDetailData
      );
      return updatedOrderDetail;
    } catch (error) {
      throw new Error('Error updating order detail');
    }
  }
  // Delete an order detail by ID
  async deleteOrderDetail(id: number): Promise<boolean> {
    try {
      const success = await OrderDetail.deleteById(id);
      return success;
    } catch (error) {
      throw new Error('Error deleting order detail');
    }
  }
}
