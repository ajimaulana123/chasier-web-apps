
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let filteredCustomers = customers;
    
    if (search) {
      filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredCustomers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer = {
      id: customers.length + 1,
      ...body,
      currentDebt: 0,
      createdAt: new Date().toISOString(),
    };
    
    customers.push(newCustomer);
    
    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
