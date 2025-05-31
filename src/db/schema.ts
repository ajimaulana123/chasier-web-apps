
import { pgTable, serial, varchar, integer, decimal, timestamp, boolean } from 'drizzle-orm/pg-core';

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  unit: varchar('unit', { length: 50 }).notNull(),
  minStock: integer('min_stock').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: varchar('address', { length: 500 }),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }).default('0'),
  currentDebt: decimal('current_debt', { precision: 12, scale: 2 }).default('0'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sales table
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  customerName: varchar('customer_name', { length: 255 }),
  total: decimal('total', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  isCredit: boolean('is_credit').notNull().default(false),
  notes: varchar('notes', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sale items table
export const saleItems = pgTable('sale_items', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').references(() => sales.id),
  productId: integer('product_id').references(() => products.id),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
});

// Credit payments table
export const creditPayments = pgTable('credit_payments', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  saleId: integer('sale_id').references(() => sales.id),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  notes: varchar('notes', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});
