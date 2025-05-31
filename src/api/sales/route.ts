
import { db } from '@/db/client';
import { sales } from '@/db/schema';
import { eq, gte, lte, and } from 'drizzle-orm';

// Mock data untuk demo
let mockSales = [
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

export const getSales = async (params?: { startDate?: string; endDate?: string }) => {
  try {
    let filteredSales = mockSales;
    
    if (params?.startDate && params?.endDate) {
      filteredSales = mockSales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= new Date(params.startDate!) && saleDate <= new Date(params.endDate!);
      });
    }
    
    return {
      success: true,
      data: filteredSales,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch sales',
    };
  }
};

export const createSale = async (saleData: Omit<typeof mockSales[0], 'id' | 'date'>) => {
  try {
    const newSale = {
      id: mockSales.length + 1,
      ...saleData,
      date: new Date().toISOString(),
    };
    
    mockSales.push(newSale);
    
    return {
      success: true,
      data: newSale,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create sale',
    };
  }
};

// Fungsi untuk menggunakan database Drizzle (uncomment ketika database sudah ready)
/*
export const getSalesFromDB = async (params?: { startDate?: string; endDate?: string }) => {
  try {
    let query = db.select().from(sales);
    
    if (params?.startDate && params?.endDate) {
      query = query.where(
        and(
          gte(sales.createdAt, new Date(params.startDate)),
          lte(sales.createdAt, new Date(params.endDate))
        )
      );
    }
    
    const result = await query;
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch sales',
    };
  }
};
*/
