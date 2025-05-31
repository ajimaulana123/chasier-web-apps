
// Mock data untuk demo
let customers = [
  {
    id: 1,
    name: 'Ahmad Wijaya',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 123',
    creditLimit: 1000000,
    currentDebt: 250000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    phone: '081987654321',
    address: 'Jl. Sudirman No. 456',
    creditLimit: 500000,
    currentDebt: 100000,
    createdAt: new Date().toISOString(),
  },
];

export const getCustomers = async (params?: { search?: string }) => {
  try {
    let filteredCustomers = customers;
    
    if (params?.search) {
      filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        customer.phone.includes(params.search!)
      );
    }
    
    return {
      success: true,
      data: filteredCustomers,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch customers',
    };
  }
};

export const createCustomer = async (customerData: Omit<typeof customers[0], 'id' | 'currentDebt' | 'createdAt'>) => {
  try {
    const newCustomer = {
      id: customers.length + 1,
      ...customerData,
      currentDebt: 0,
      createdAt: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    
    return {
      success: true,
      data: newCustomer,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create customer',
    };
  }
};
