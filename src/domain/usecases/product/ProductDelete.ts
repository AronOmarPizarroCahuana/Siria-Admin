import { ProductRepository } from '@/domain/repositories/product/ProductRepository';

export class ProductDelete {
  constructor(private repository: ProductRepository) {}

  async execute(id: string) {
    return await this.repository.deleteProduct(id);
  }
}