
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, Package, Users, DollarSign, AlertTriangle, TrendingUp, Calendar, Download } from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import SalesInterface from '@/components/SalesInterface';
import CustomerManagement from '@/components/CustomerManagement';
import ReportsPanel from '@/components/ReportsPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  // Mock data for dashboard
  const salesData = [
    { name: 'Sen', sales: 12000000, transactions: 45 },
    { name: 'Sel', sales: 8000000, transactions: 32 },
    { name: 'Rab', sales: 15000000, transactions: 58 },
    { name: 'Kam', sales: 11000000, transactions: 41 },
    { name: 'Jum', sales: 18000000, transactions: 67 },
    { name: 'Sab', sales: 22000000, transactions: 78 },
    { name: 'Min', sales: 16000000, transactions: 55 },
  ];

  const topProducts = [
    { name: 'Indomie Goreng', sold: 245, revenue: 2450000 },
    { name: 'Teh Botol Sosro', sold: 189, revenue: 945000 },
    { name: 'Aqua 600ml', sold: 167, revenue: 835000 },
    { name: 'Rokok Gudang Garam', sold: 134, revenue: 3350000 },
  ];

  const categoryData = [
    { name: 'Makanan', value: 35, color: '#3b82f6' },
    { name: 'Minuman', value: 28, color: '#10b981' },
    { name: 'Rokok', value: 20, color: '#f59e0b' },
    { name: 'Lainnya', value: 17, color: '#6366f1' },
  ];

  const stats = [
    {
      title: 'Penjualan Hari Ini',
      value: 'Rp 2.450.000',
      change: '+12%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Transaksi',
      value: '67',
      change: '+8%',
      icon: ShoppingCart,
      positive: true,
    },
    {
      title: 'Produk Terjual',
      value: '342',
      change: '+15%',
      icon: Package,
      positive: true,
    },
    {
      title: 'Pelanggan Aktif',
      value: '28',
      change: '+3%',
      icon: Users,
      positive: true,
    },
  ];

  const lowStockProducts = [
    { name: 'Indomie Ayam Bawang', stock: 5, minStock: 20 },
    { name: 'Teh Pucuk Harum', stock: 3, minStock: 15 },
    { name: 'Sabun Mandi Lifebuoy', stock: 2, minStock: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin POS System
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Kelola toko Anda dengan mudah dan efisien
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="products" className="text-sm">Produk</TabsTrigger>
            <TabsTrigger value="sales" className="text-sm">Penjualan</TabsTrigger>
            <TabsTrigger value="customers" className="text-sm">Pelanggan</TabsTrigger>
            <TabsTrigger value="reports" className="text-sm">Laporan</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <p className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} dari kemarin
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sales Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Penjualan Minggu Ini
                  </CardTitle>
                  <CardDescription>
                    Grafik penjualan dan transaksi harian
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'sales' ? `Rp ${value.toLocaleString()}` : value,
                          name === 'sales' ? 'Penjualan' : 'Transaksi'
                        ]}
                      />
                      <Bar dataKey="sales" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribusi Kategori
                  </CardTitle>
                  <CardDescription>
                    Persentase penjualan per kategori
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Persentase']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produk Terlaris
                  </CardTitle>
                  <CardDescription>
                    Produk dengan penjualan tertinggi minggu ini
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {product.sold} terjual
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            Rp {product.revenue.toLocaleString()}
                          </p>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5" />
                    Peringatan Stok Rendah
                  </CardTitle>
                  <CardDescription>
                    Produk yang perlu segera diisi ulang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Min: {product.minStock} unit
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {product.stock} tersisa
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Kelola Inventori
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="sales">
            <SalesInterface />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
