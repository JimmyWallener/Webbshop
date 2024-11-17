import conn from '@db/db';

export interface OrderInterface {
  productId: number;
  quantity: number;
  createdAt: Date;
}

export interface OrderResponseInterface extends OrderInterface {
  id: number;
}

export class Order {
  id: number;
  productId: number;
  quantity: number;
  createdAt: Date;

  constructor(
    id: number,
    productId: number,
    quantity: number,
    createdAt: Date
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  static fromJson(data: OrderResponseInterface): Order {
    return new Order(data.id, data.productId, data.quantity, data.createdAt);
  }

  toJson(): OrderResponseInterface {
    return {
      id: this.id,
      productId: this.productId,
      quantity: this.quantity,
      createdAt: this.createdAt,
    };
  }

  // Database interaction methods
  static async create(order: OrderInterface): Promise<Order> {
    const statement = `
      INSERT INTO Orders (productId, quantity, createdAt)
      VALUES (?, ?, ?)
    `;
    const [result] = await conn.execute(statement, [
      order.productId,
      order.quantity,
      order.createdAt,
    ]);
    return new Order(
      (result as any).insertId,
      order.productId,
      order.quantity,
      order.createdAt
    );
  }

  static async findAll(): Promise<Order[]> {
    const [rows] = await conn.query('SELECT * FROM Orders');
    return (rows as OrderResponseInterface[]).map((row) => Order.fromJson(row));
  }

  static async findById(id: number): Promise<Order | null> {
    const statement = `SELECT * FROM Orders WHERE id = ?`;
    const [rows] = await conn.execute(statement, [id]);
    if ((rows as OrderResponseInterface[]).length === 0) {
      return null;
    }
    return Order.fromJson((rows as OrderResponseInterface[])[0]);
  }

  static async update(
    id: number,
    updatedData: Partial<OrderInterface>
  ): Promise<boolean> {
    const statement = `
      UPDATE Orders
      SET productId = ?, quantity = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(statement, [
      updatedData.productId,
      updatedData.quantity,
      id,
    ]);
    return (result as any).affectedRows > 0;
  }

  static async deleteById(id: number): Promise<boolean> {
    const statement = `DELETE FROM Orders WHERE id = ?`;
    const [result] = await conn.execute(statement, [id]);
    return (result as any).affectedRows > 0;
  }
}
