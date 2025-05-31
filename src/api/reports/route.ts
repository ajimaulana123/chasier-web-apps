
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    
    // Mock data untuk demo
    const dashboardData = {
      todayRevenue: 2450000,
      todayTransactions: 67,
      todayProducts: 342,
      activeCustomers: 28,
      salesData: [
        { name: 'Sen', sales: 12000000, transactions: 45 },
        { name: 'Sel', sales: 8000000, transactions: 32 },
        { name: 'Rab', sales: 15000000, transactions: 58 },
        { name: 'Kam', sales: 11000000, transactions: 41 },
        { name: 'Jum', sales: 18000000, transactions: 67 },
        { name: 'Sab', sales: 22000000, transactions: 78 },
        { name: 'Min', sales: 16000000, transactions: 55 },
      ],
      topProducts: [
        { name: 'Indomie Goreng', sold: 245, revenue: 2450000 },
        { name: 'Teh Botol Sosro', sold: 189, revenue: 945000 },
        { name: 'Aqua 600ml', sold: 167, revenue: 835000 },
        { name: 'Rokok Gudang Garam', sold: 134, revenue: 3350000 },
      ],
      lowStockProducts: [
        { name: 'Indomie Ayam Bawang', stock: 5, minStock: 20 },
        { name: 'Teh Pucuk Harum', stock: 3, minStock: 15 },
        { name: 'Sabun Mandi Lifebuoy', stock: 2, minStock: 10 },
      ],
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
