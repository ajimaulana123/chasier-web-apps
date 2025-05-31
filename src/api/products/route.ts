
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    let filteredProducts = products;
    
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = {
      id: products.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    products[productIndex] = { ...products[productIndex], ...updateData };
    
    return NextResponse.json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    products.splice(productIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
