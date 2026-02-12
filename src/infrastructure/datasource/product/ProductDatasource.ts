export const ProductDatasource = {
  async getAll(pageNumber: number = 1, pageSize: number = 10) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/products?page_number=${pageNumber}&page_size=${pageSize}`;
    
    console.log('🔍 Fetching products from:', url);
    console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener productos'}`);
    }

    const data = await response.json();
    console.log('✅ Response data:', data);
    
    return data;
  },

  async getId(id: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener producto:', errorData);
      throw new Error(errorData.meta?.message || 'Error al obtener producto');
    }

    return await response.json();
  },

  async create(productData: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const price = parseFloat(productData.price);
    const stock = productData.stock ? parseInt(productData.stock, 10) : null;
    
    if (isNaN(price)) {
      throw new Error('El precio debe ser un número válido');
    }
    
    if (productData.stock && stock !== null && isNaN(stock)) {
      throw new Error('El stock debe ser un número válido');
    }
    
    const payload = {
      name: productData.name,
      description: productData.description,
      price: price,
      stock: stock,
      image_url: productData.image_url || null
    };

    console.log('📤 Creating product with payload:', payload);
    console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    console.log('📡 Create response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al crear producto:', errorData);
      console.error('❌ Response status:', response.status);
      
      // Mensajes específicos según el código de error
      if (response.status === 409) {
        throw new Error('El producto ya existe o hay un conflicto con los datos');
      }
      if (response.status === 400) {
        throw new Error(errorData.meta?.message || 'Datos inválidos. Verifica los campos');
      }
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente');
      }
      
      throw new Error(errorData.meta?.message || 'Error al crear producto');
    }

    const data = await response.json();
    console.log('✅ Product created:', data);
    return data;
  },

  async update(id: string, productData: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    // Preparar los datos según la especificación del API
    const payload = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      stock: productData.stock ? Number(productData.stock) : null,
      image_url: productData.image_url || null
    };

    console.log('📤 Updating product:', id, 'with payload:', payload);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    console.log('📡 Update response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al actualizar producto:', errorData);
      
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      if (response.status === 400) {
        throw new Error(errorData.meta?.message || 'Datos inválidos. Verifica los campos');
      }
      
      throw new Error(errorData.meta?.message || 'Error al actualizar producto');
    }

    const data = await response.json();
    console.log('✅ Product updated:', data);
    return data;
  },

  async delete(id: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    console.log('🗑️ Deleting product:', id);
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      },
    );

    console.log('📡 Delete response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al eliminar producto:', errorData);
      
      if (response.status === 404) {
        throw new Error('Producto no encontrado');
      }
      
      throw new Error(errorData.meta?.message || 'Error al eliminar producto');
    }

    const data = await response.json();
    console.log('✅ Product deleted:', data);
    return data;
  },
};