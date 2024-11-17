import { Product, ProductInterface } from '@models/product.model';

export class ProductService {
  // Create a new product
  async createProduct(productData: ProductInterface): Promise<Product> {
    try {
      const newProduct = await Product.create(productData);
      return newProduct;
    } catch (error) {
      throw new Error('Error creating product');
    }
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const products = await Product.findAll();
      return products;
    } catch (error) {
      throw new Error('Error fetching products');
    }
  }

  // Get a single product by ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      throw new Error('Error fetching product');
    }
  }

  // Update a product
  async updateProduct(
    id: number,
    updatedData: ProductInterface
  ): Promise<boolean> {
    try {
      const success = await Product.update(id, updatedData);
      return success;
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  // Delete a product
  async deleteProduct(id: number): Promise<boolean> {
    try {
      const success = await Product.deleteById(id);
      return success;
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }
}
