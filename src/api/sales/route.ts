
import { NextRequest, NextResponse } from 'next/server';

// Mock data untuk demo
let sales = [
  {
    id: 1,
    customerName: 'Walk-in Customer',
    items: [
      { productId: 1, productName: 'Indomie Goreng', quantity: 2, price: 3000 },
    ],
    total: 6000,
    paymentMethod: 'cash',
    date: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let filteredSales = sales;
    
    if (startDate && endDate) {
      filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
      });
    }
    
    return NextResponse.json({
      success: true,
      data: filteredSales,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSale = {
      id: sales.length + 1,
      ...body,
      date: new Date().toISOString(),
    };
    
    sales.push(newSale);
    
    return NextResponse.json({
      success: true,
      data: newSale,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
