import conn from '@db/db';
import { RowDataPacket } from 'mysql2';

export interface ProductInterface {
  name: string;
  articleNumber: string;
  price: number;
  description: string;
}

export interface ProductResponseInterface extends ProductInterface {
  id: number;
}

export class Product {
  id: number;
  name: string;
  articleNumber: string;
  price: number;
  description: string;

  constructor(
    id: number,
    name: string,
    articleNumber: string,
    price: number,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.articleNumber = articleNumber;
    this.price = price;
    this.description = description;
  }

  static fromJson(data: ProductResponseInterface): Product {
    return new Product(
      data.id,
      data.name,
      data.articleNumber,
      data.price,
      data.description
    );
  }

  toJson(): ProductResponseInterface {
    return {
      id: this.id,
      name: this.name,
      articleNumber: this.articleNumber,
      price: this.price,
      description: this.description,
    };
  }

  // Database interaction methods
  static async create(product: ProductInterface): Promise<Product> {
    const statement = `
      INSERT INTO Products (name, articleNumber, price, description)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await conn.execute(statement, [
      product.name,
      product.articleNumber,
      product.price,
      product.description,
    ]);
    return new Product(
      (result as RowDataPacket).insertId,
      product.name,
      product.articleNumber,
      product.price,
      product.description
    );
  }

  static async findAll(): Promise<Product[]> {
    const [rows] = await conn.query('SELECT * FROM Products');
    return (rows as ProductResponseInterface[]).map((row) =>
      Product.fromJson(row)
    );
  }

  static async findById(id: number): Promise<Product | null> {
    const statement = `SELECT * FROM Products WHERE id = ?`;
    const [rows] = await conn.execute(statement, [id]);
    if ((rows as ProductResponseInterface[]).length === 0) {
      return null;
    }
    return Product.fromJson((rows as ProductResponseInterface[])[0]);
  }

  static async update(
    id: number,
    updatedData: ProductInterface
  ): Promise<boolean> {
    const statement = `
      UPDATE Products
      SET name = ?, articleNumber = ?, price = ?, description = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(statement, [
      updatedData.name,
      updatedData.articleNumber,
      updatedData.price,
      updatedData.description,
      id,
    ]);
    return (result as RowDataPacket).affectedRows > 0;
  }

  static async deleteById(id: number): Promise<boolean> {
    const statement = `DELETE FROM Products WHERE id = ?`;
    const [result] = await conn.execute(statement, [id]);
    return (result as RowDataPacket).affectedRows > 0;
  }
}
