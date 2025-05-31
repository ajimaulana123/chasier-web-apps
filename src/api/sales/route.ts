
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

export const getSales = async (params?: { startDate?: string; endDate?: string }) => {
  try {
    let filteredSales = sales;
    
    if (params?.startDate && params?.endDate) {
      filteredSales = sales.filter(sale => {
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

export const createSale = async (saleData: Omit<typeof sales[0], 'id' | 'date'>) => {
  try {
    const newSale = {
      id: sales.length + 1,
      ...saleData,
      date: new Date().toISOString(),
    };
    
    sales.push(newSale);
    
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
