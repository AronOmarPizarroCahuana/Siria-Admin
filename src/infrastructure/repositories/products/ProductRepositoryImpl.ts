import { ProductRepository } from '@/domain/repositories/product/ProductRepository';
import { ProductEntity } from '@/domain/entities/product/ProductEntity';
import { Message } from '@/domain/entities/MessageEntity';
import { ProductDatasource } from '@/infrastructure/datasource/product/ProductDatasource';
import { ProductMapper } from '@/infrastructure/mappers/product/ProductMappers';

export class ProductRepositoryImpl implements ProductRepository {
  async getAllProducts(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<{ products: ProductEntity[]; message: Message }> {
    try {
      const response = await ProductDatasource.getAll(pageNumber, pageSize);
      
      console.log('Product API Response:', response);

      // Manejar diferentes estructuras de respuesta
      let products: ProductEntity[] = [];
      
      if (response.data?.products) {
        products = ProductMapper.toDomainList(response.data.products);
      } else if (response.products) {
        products = ProductMapper.toDomainList(response.products);
      } else if (Array.isArray(response.data)) {
        products = ProductMapper.toDomainList(response.data);
      } else if (Array.isArray(response)) {
        products = ProductMapper.toDomainList(response);
      }

      return {
        products,
        message: {
          status: response.meta?.status ?? true,
          message: response.meta?.message ?? 'Productos obtenidos exitosamente',
        },
      };
    } catch (error) {
      console.error('Error in ProductRepository:', error);
      return {
        products: [],
        message: {
          status: false,
          message: error instanceof Error ? error.message : 'Error al obtener productos',
        },
      };
    }
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string | null;
  }): Promise<{ product: ProductEntity; message: Message }> {
    try {
      const response = await ProductDatasource.create(data);
      
      console.log('📦 Create response in repository:', response);
      
      // ✅ SOLUCIÓN: Si la API no devuelve data, crear un producto placeholder
      // y luego hacer fetch de la lista actualizada o buscar por nombre
      if (!response.data) {
        console.log('⚠️ No data in response, creating placeholder product');
        
        // Crear un producto temporal con los datos que enviamos
        const placeholderProduct: ProductEntity = {
          id: 'temp-' + Date.now(), // ID temporal
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          image_url: data.image_url || '',
        };
        
        return {
          product: placeholderProduct,
          message: {
            status: response.meta?.status ?? true,
            message: response.meta?.message ?? 'Producto creado exitosamente',
          },
        };
      }
      
      return {
        product: ProductMapper.toDomain(response.data),
        message: {
          status: response.meta?.status ?? true,
          message: response.meta?.message ?? 'Producto creado exitosamente',
        },
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error al crear el producto');
    }
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      image_url?: string | null;
    }
  ): Promise<{ product: ProductEntity; message: Message }> {
    try {
      const response = await ProductDatasource.update(id, data);
      
      console.log('📦 Update response in repository:', response);
      
      // ✅ CORRECCIÓN CRÍTICA: La API solo devuelve meta, no data
      // Cuando actualizas, la API no devuelve el producto completo, solo la confirmación
      // Por lo tanto, necesitamos manejar esto de forma diferente
      
      // Opción 1: Si response.data existe, usarlo
      if (response.data) {
        return {
          product: ProductMapper.toDomain(response.data),
          message: {
            status: response.meta?.status ?? true,
            message: response.meta?.message ?? 'Producto actualizado exitosamente',
          },
        };
      }
      
      // Opción 2: Si no hay data, crear un producto con los datos que tenemos
      // Esto es un workaround porque la API no devuelve el producto completo
      const updatedProduct: ProductEntity = {
        id: id,
        name: data.name ?? '',
        description: data.description ?? '',
        price: data.price ?? 0,
        stock: data.stock ?? 0,
        image_url: data.image_url ?? '',
      };
      
      return {
        product: updatedProduct,
        message: {
          status: response.meta?.status ?? true,
          message: response.meta?.message ?? 'Producto actualizado exitosamente',
        },
      };
    } catch (error) {
      console.error('❌ Error in updateProduct repository:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al actualizar el producto');
    }
  }

  async deleteProduct(id: string): Promise<{ message: Message }> {
    try {
      const response = await ProductDatasource.delete(id);
      
      return {
        message: {
          status: response.meta?.status ?? true,
          message: response.meta?.message ?? 'Producto eliminado exitosamente',
        },
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error al eliminar el producto');
    }
  }
}