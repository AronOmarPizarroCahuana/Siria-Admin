import { ProductRepository } from '@/domain/repositories/product/ProductRepository';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string | null;
}

export class ProductCreate {
  constructor(private repository: ProductRepository) {}

  async execute(data: CreateProductDTO) {
    return await this.repository.createProduct(data);
  }
}