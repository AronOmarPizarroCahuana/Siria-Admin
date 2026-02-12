import { Message } from "@/domain/entities/MessageEntity";
import { ProductEntity } from "@/domain/entities/product/ProductEntity";
import { ProductRepository } from "@/domain/repositories/product/ProductRepository";

export class ProductGetAll {
  constructor(private productsRepository: ProductRepository) {}

  async execute(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<{ products: ProductEntity[]; message: Message }> {
    return this.productsRepository.getAllProducts(pageNumber, pageSize);
  }
}
