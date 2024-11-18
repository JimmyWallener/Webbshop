import conn from '@db/db';
import { RowDataPacket } from 'mysql2';

export interface ProductInterface {
  id: number;
  name: string;
  articleNumber: string;
  description: string;
  price: number;
}

export interface OrderDetailInterface {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface OrderDetailResponseInterface {
  id: number;
  orderId: number;
  quantity: number;
  totalPrice: number;
  product: ProductInterface;
}

export class OrderDetail {
  id: number;
  orderId: number;
  product: ProductInterface;
  quantity: number;
  totalPrice: number;

  constructor(
    id: number,
    orderId: number,
    product: ProductInterface,
    quantity: number,
    totalPrice: number
  ) {
    this.id = id;
    this.orderId = orderId;
    this.product = product;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
  }

  static fromJson(data: OrderDetailResponseInterface): OrderDetail {
    return new OrderDetail(
      data.id,
      data.orderId,
      data.product,
      data.quantity,
      data.totalPrice
    );
  }

  toJson(): OrderDetailResponseInterface {
    return {
      id: this.id,
      orderId: this.orderId,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
      product: this.product,
    };
  }

  // Create a new order detail
  static async create(orderDetail: OrderDetailInterface): Promise<OrderDetail> {
    const priceQuery = `
      SELECT price FROM Products WHERE id = ?
    `;
    const [productRows] = await conn.execute(priceQuery, [
      orderDetail.productId,
    ]);

    if ((productRows as RowDataPacket[]).length === 0) {
      throw new Error('Product not found');
    }

    const { name, price, description, articleNumber } = (
      productRows as RowDataPacket[]
    )[0];
    const totalPrice = orderDetail.quantity * price;

    const statement = `
      INSERT INTO Details (orderId, productId, quantity)
      VALUES (?, ?, ?)
    `;
    const [result] = await conn.execute(statement, [
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
    ]);

    return new OrderDetail(
      (result as RowDataPacket).insertId,
      orderDetail.orderId,
      {
        id: orderDetail.productId,
        name: name,
        description: description,
        articleNumber: articleNumber,
        price: price,
      },
      orderDetail.quantity,
      totalPrice
    );
  }

  // Fetch all order details with JOIN
  static async findAll(): Promise<OrderDetail[]> {
    const statement = `
      SELECT 
        d.id AS id,
        d.orderId AS orderId,
        d.quantity AS quantity,
        (d.quantity * p.price) AS totalPrice,
        p.id AS productId,
        p.name AS productName,
        p.articleNumber AS productArticleNumber,
        p.description AS productDescription,
        p.price AS productPrice
      FROM Details d
      JOIN Products p ON d.productId = p.id
    `;
    const [rows] = await conn.query(statement);

    return (rows as RowDataPacket[]).map((row) =>
      OrderDetail.fromJson({
        id: row.id,
        orderId: row.orderId,
        quantity: row.quantity,
        totalPrice: row.totalPrice,
        product: {
          id: row.productId,
          name: row.productName,
          articleNumber: row.productArticleNumber,
          description: row.productDescription,
          price: row.productPrice,
        },
      })
    );
  }

  // Update order detail by ID
  static async updateById(
    id: number,
    orderDetail: OrderDetailInterface
  ): Promise<OrderDetail | null> {
    const priceQuery = `
      SELECT price FROM Products WHERE id = ?
    `;
    const [productRows] = await conn.execute(priceQuery, [
      orderDetail.productId,
    ]);

    if ((productRows as RowDataPacket[]).length === 0) {
      throw new Error('Product not found');
    }

    const { name, articleNumber, price, description } = (
      productRows as RowDataPacket[]
    )[0];
    const totalPrice = orderDetail.quantity * price;

    const statement = `
      UPDATE Details
      SET orderId = ?, productId = ?, quantity = ?, totalPrice = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(statement, [
      orderDetail.orderId,
      orderDetail.productId,
      orderDetail.quantity,
      totalPrice,
      id,
    ]);

    if ((result as RowDataPacket).affectedRows === 0) {
      return null;
    }

    return new OrderDetail(
      id,
      orderDetail.orderId,
      {
        id: orderDetail.productId,
        name: name,
        articleNumber: articleNumber,
        description: description,
        price: price,
      },
      orderDetail.quantity,
      totalPrice
    );
  }

  // Fetch order details by orderId with JOIN
  static async findByOrderId(orderId: number): Promise<OrderDetail[]> {
    const statement = `
      SELECT 
        d.id AS id,
        d.orderId AS orderId,
        d.quantity AS quantity,
        (d.quantity * p.price) AS totalPrice,
        p.id AS productId,
        p.name AS productName,
        p.description AS productDescription,
        p.price AS productPrice
      FROM Details d
      JOIN Products p ON d.productId = p.id
      WHERE d.orderId = ?
    `;
    const [rows] = await conn.execute(statement, [orderId]);

    return (rows as RowDataPacket[]).map((row) =>
      OrderDetail.fromJson({
        id: row.id,
        orderId: row.orderId,
        quantity: row.quantity,
        totalPrice: row.totalPrice,
        product: {
          id: row.productId,
          name: row.productName,
          articleNumber: row.productArticleNumber,
          description: row.productDescription,
          price: row.productPrice,
        },
      })
    );
  }

  // Delete order detail by ID
  static async deleteById(id: number): Promise<boolean> {
    const statement = `DELETE FROM Details WHERE id = ?`;
    const [result] = await conn.execute(statement, [id]);

    return (result as RowDataPacket).affectedRows > 0;
  }
}
