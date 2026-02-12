import { ProductRepository } from '@/domain/repositories/product/ProductRepository';

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string | null;
}

export class ProductUpdate {
  constructor(private repository: ProductRepository) {}

  async execute(id: string, data: UpdateProductDTO) {
    return await this.repository.updateProduct(id, data);
  }
}