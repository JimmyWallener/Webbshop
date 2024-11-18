import conn from '@db/db';

export interface OrderInterface {
  createdAt: Date;
}

export interface OrderResponseInterface extends OrderInterface {
  id: number;
}

export class Order {
  id: number;
  createdAt: Date;

  constructor(id: number, createdAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
  }

  static fromJson(data: OrderResponseInterface): Order {
    return new Order(data.id, data.createdAt);
  }

  toJson(): OrderResponseInterface {
    return {
      id: this.id,
      createdAt: this.createdAt,
    };
  }

  // Database interaction methods
  static async create(order: OrderInterface): Promise<Order> {
    const statement = `
      INSERT INTO Orders (createdAt)
      VALUES (?)
    `;
    const [result] = await conn.execute(statement, [order.createdAt]);
    return new Order((result as any).insertId, order.createdAt);
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

  static async updateById(
    id: number,
    order: OrderInterface
  ): Promise<Order | null> {
    const statement = `UPDATE Orders SET createdAt = ? WHERE id = ?`;
    const [result] = await conn.execute(statement, [order.createdAt, id]);
    if ((result as any).affectedRows === 0) {
      return null;
    }
    return new Order(id, order.createdAt);
  }

  static async deleteById(id: number): Promise<boolean> {
    const statement = `DELETE FROM Orders WHERE id = ?`;
    const [result] = await conn.execute(statement, [id]);
    return (result as any).affectedRows > 0;
  }
}
