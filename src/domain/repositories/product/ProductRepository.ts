import { Message } from "@/domain/entities/MessageEntity";
import { ProductEntity } from "@/domain/entities/product/ProductEntity";

export interface ProductRepository {
  //GetAll
  getAllProducts(
    pageNumber: number,
    pageSize: number,
  ): Promise<{ products: ProductEntity[]; message: Message }>;

  // Create
  createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string | null;
  }): Promise<{ product: ProductEntity; message: Message }>;

  // Update
  updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      image_url?: string | null;
    }
  ): Promise<{ product: ProductEntity; message: Message }>;

  // Delete
  deleteProduct(id: string): Promise<{ message: Message }>;
}
