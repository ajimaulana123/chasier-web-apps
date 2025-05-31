import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, Package, Users, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getReports } from '@/api/reports/route';

const DashboardPanel = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categoryData = [
    { name: 'Makanan', value: 35, color: '#3b82f6' },
    { name: 'Minuman', value: 28, color: '#10b981' },
    { name: 'Rokok', value: 20, color: '#f59e0b' },
    { name: 'Lainnya', value: 17, color: '#6366f1' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const result = await getReports('dashboard');
      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center h-64">Error loading data</div>;
  }

  const stats = [
    {
      title: 'Penjualan Hari Ini',
      value: `Rp ${dashboardData.todayRevenue.toLocaleString()}`,
      change: '+12%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Transaksi',
      value: dashboardData.todayTransactions.toString(),
      change: '+8%',
      icon: ShoppingCart,
      positive: true,
    },
    {
      title: 'Produk Terjual',
      value: dashboardData.todayProducts.toString(),
      change: '+15%',
      icon: Package,
      positive: true,
    },
    {
      title: 'Pelanggan Aktif',
      value: dashboardData.activeCustomers.toString(),
      change: '+3%',
      icon: Users,
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
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
              <BarChart data={dashboardData.salesData}>
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
              {dashboardData.topProducts.map((product: any, index: number) => (
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
              {dashboardData.lowStockProducts.map((product: any, index: number) => (
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
    </div>
  );
};

export default DashboardPanel;
