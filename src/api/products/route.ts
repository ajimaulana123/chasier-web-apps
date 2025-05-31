
import { db } from '@/db/client';
import { products } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

// Mock data untuk demo - nanti akan diganti dengan Drizzle ORM
let mockProducts = [
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
    // Untuk development, gunakan mock data
    // Nanti akan diganti dengan query database
    let filteredProducts = mockProducts;
    
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

export const createProduct = async (productData: Omit<typeof mockProducts[0], 'id' | 'createdAt'>) => {
  try {
    const newProduct = {
      id: mockProducts.length + 1,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    
    mockProducts.push(newProduct);
    
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

export const updateProduct = async (id: number, updateData: Partial<typeof mockProducts[0]>) => {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found',
      };
    }
    
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...updateData };
    
    return {
      success: true,
      data: mockProducts[productIndex],
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
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Product not found',
      };
    }
    
    mockProducts.splice(productIndex, 1);
    
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

// Fungsi untuk menggunakan database Drizzle (uncomment ketika database sudah ready)
/*
export const getProductsFromDB = async (params?: { search?: string; category?: string }) => {
  try {
    let query = db.select().from(products);
    
    const conditions = [];
    
    if (params?.search) {
      conditions.push(
        or(
          like(products.name, `%${params.search}%`),
          like(products.code, `%${params.search}%`)
        )
      );
    }
    
    if (params?.category && params.category !== 'all') {
      conditions.push(eq(products.category, params.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const result = await query;
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch products',
    };
  }
};
*/
