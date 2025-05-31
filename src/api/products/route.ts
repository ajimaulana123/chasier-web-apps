
// Mock data untuk demo - nanti akan diganti dengan Drizzle ORM
let products = [
  {
    id: 1,
    code: 'P001',
    name: 'Indomie Goreng',
    category: 'Makanan',
    purchasePrice: 2500,
    sellingPrice: 3000,
    stock: 150,
    unit: 'pcs',
    minStock: 20,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'P002',
    name: 'Teh Botol Sosro',
    category: 'Minuman',
    purchasePrice: 4000,
    sellingPrice: 5000,
    stock: 80,
    unit: 'botol',
    minStock: 15,
    createdAt: new Date().toISOString(),
  },
];

export const getProducts = async (params?: { search?: string; category?: string }) => {
  try {
    let filteredProducts = products;
    
    if (params?.search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        product.code.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params?.category && params.category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === params.category!.toLowerCase()
      );
    }
    
    return {
      success: true,
      data: filteredProducts,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch products',
    };
  }
};

export const createProduct = async (productData: Omit<typeof products[0], 'id' | 'createdAt'>) => {
  try {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    
    return {
      success: true,
      data: newProduct,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create product',
    };
  }
};

export const updateProduct = async (id: number, updateData: Partial<typeof products[0]>) => {
  try {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found',
      };
    }
    
    products[productIndex] = { ...products[productIndex], ...updateData };
    
    return {
      success: true,
      data: products[productIndex],
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update product',
    };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found',
      };
    }
    
    products.splice(productIndex, 1);
    
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete product',
    };
  }
};
