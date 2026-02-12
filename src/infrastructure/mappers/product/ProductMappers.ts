import { ProductEntity } from '@/domain/entities/product/ProductEntity';

export class ProductMapper {
  static toDomain(dto: ProductEntity): ProductEntity {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock ?? 0,
      image_url: dto.image_url,
    };
  }

  static toDomainList(dtos: ProductEntity[]): ProductEntity[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static toDto(entity: ProductEntity): ProductEntity {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      image_url: entity.image_url,
    };
  }
}