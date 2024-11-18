import conn from '@db/db';
import { RowDataPacket } from 'mysql2';
export interface OrderDetailInterface {
  orderId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderDetailResponseInterface extends OrderDetailInterface {
  id: number;
}

export class OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  totalPrice: number;

  constructor(
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    totalPrice: number
  ) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
  }

  static fromJson(data: OrderDetailResponseInterface): OrderDetail {
    return new OrderDetail(
      data.id,
      data.orderId,
      data.productId,
      data.quantity,
      data.totalPrice
    );
  }

  toJson(): OrderDetailResponseInterface {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
    };
  }

  // Create a new order detail in the database
  static async create(orderDetail: OrderDetailInterface): Promise<OrderDetail> {
    const statement = `
      INSERT INTO Details (orderId, productId, quantity, totalPrice)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await conn.execute(statement, [
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
      orderDetail.totalPrice,
    ]);
    return new OrderDetail(
      (result as any).insertId,
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
      orderDetail.totalPrice
    );
  }

  // Fetch all order details
  static async findAll(): Promise<OrderDetail[]> {
    const [rows] = await conn.query('SELECT * FROM Details');
    return (rows as OrderDetailResponseInterface[]).map((row) =>
      OrderDetail.fromJson(row)
    );
  }

  // Fetch order details by orderId
  static async findByOrderId(orderId: number): Promise<OrderDetail[]> {
    const statement = `
      SELECT * FROM Details WHERE orderId = ?
    `;
    const [rows] = await conn.execute(statement, [orderId]);
    return (rows as OrderDetailResponseInterface[]).map((row) =>
      OrderDetail.fromJson(row)
    );
  }

  // Update an order detail by ID
  static async updateById(
    id: number,
    orderDetail: OrderDetailInterface
  ): Promise<OrderDetail | null> {
    const statement = `
      UPDATE Details
      SET orderId = ?, productId = ?, quantity = ?, totalPrice = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(statement, [
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
      orderDetail.totalPrice,
      id,
    ]);
    if ((result as RowDataPacket).affectedRows === 0) {
      return null;
    }
    return new OrderDetail(
      id,
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
      orderDetail.totalPrice
    );
  }

  // Delete an order detail by ID
  static async deleteById(id: number): Promise<boolean> {
    const statement = `DELETE FROM Details WHERE id = ?`;
    const [result] = await conn.execute(statement, [id]);
    return (result as RowDataPacket).affectedRows > 0;
  }
}
