
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportsPanel = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data for reports
  const salesData = [
    { date: '2024-01-01', revenue: 2450000, transactions: 45, profit: 650000 },
    { date: '2024-01-02', revenue: 1800000, transactions: 32, profit: 480000 },
    { date: '2024-01-03', revenue: 3200000, transactions: 58, profit: 850000 },
    { date: '2024-01-04', revenue: 2100000, transactions: 41, profit: 560000 },
    { date: '2024-01-05', revenue: 2850000, transactions: 67, profit: 760000 },
    { date: '2024-01-06', revenue: 3450000, transactions: 78, profit: 920000 },
    { date: '2024-01-07', revenue: 2650000, transactions: 55, profit: 710000 },
  ];

  const topProducts = [
    { name: 'Indomie Goreng', sold: 245, revenue: 735000, profit: 245000 },
    { name: 'Aqua 600ml', sold: 189, revenue: 945000, profit: 378000 },
    { name: 'Teh Botol Sosro', sold: 167, revenue: 835000, profit: 334000 },
    { name: 'Gudang Garam', sold: 134, revenue: 3350000, profit: 402000 },
    { name: 'Sabun Lifebuoy', sold: 98, revenue: 1176000, profit: 392000 },
  ];

  const categoryPerformance = [
    { name: 'Makanan', sales: 8500000, profit: 2125000, percentage: 35 },
    { name: 'Minuman', sales: 6800000, profit: 1904000, percentage: 28 },
    { name: 'Rokok', sales: 4850000, profit: 970000, percentage: 20 },
    { name: 'Kebersihan', sales: 2890000, profit: 867000, percentage: 12 },
    { name: 'Lainnya', sales: 1210000, profit: 363000, percentage: 5 },
  ];

  const monthlyTrend = [
    { month: 'Okt', revenue: 45000000, profit: 11250000 },
    { month: 'Nov', revenue: 52000000, profit: 13520000 },
    { month: 'Des', revenue: 68000000, profit: 17680000 },
    { month: 'Jan', revenue: 58000000, profit: 15080000 },
  ];

  const pieChartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
  const totalTransactions = salesData.reduce((sum, item) => sum + item.transactions, 0);
  const averageTransaction = totalRevenue / totalTransactions;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  const handleExportReport = (type) => {
    // Simulate PDF export
    if (type === 'PDF') {
      const reportData = {
        title: 'Laporan Penjualan',
        period: dateRange,
        totalRevenue,
        totalProfit,
        totalTransactions,
        salesData,
        topProducts,
        categoryPerformance
      };
      
      // Create a simple text-based report
      const reportContent = `
LAPORAN PENJUALAN TOKO
======================

Periode: ${dateRange}
Tanggal: ${new Date().toLocaleDateString('id-ID')}

RINGKASAN
---------
Total Pendapatan: Rp ${totalRevenue.toLocaleString()}
Total Keuntungan: Rp ${totalProfit.toLocaleString()}
Total Transaksi: ${totalTransactions}
Rata-rata per Transaksi: Rp ${averageTransaction.toFixed(0)}
Margin Keuntungan: ${profitMargin.toFixed(1)}%

PRODUK TERLARIS
---------------
${topProducts.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.sold} unit - Rp ${product.revenue.toLocaleString()}`
).join('\n')}

PERFORMA KATEGORI
-----------------
${categoryPerformance.map(cat => 
  `${cat.name}: Rp ${cat.sales.toLocaleString()} (${cat.percentage}%)`
).join('\n')}
      `;
      
      // Create and download the file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-penjualan-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    // Simulate Excel export
    if (type === 'Excel') {
      const csvContent = [
        ['Laporan Penjualan Toko'],
        [''],
        ['Periode:', dateRange],
        ['Tanggal:', new Date().toLocaleDateString('id-ID')],
        [''],
        ['RINGKASAN'],
        ['Total Pendapatan', totalRevenue],
        ['Total Keuntungan', totalProfit],
        ['Total Transaksi', totalTransactions],
        ['Rata-rata per Transaksi', Math.round(averageTransaction)],
        ['Margin Keuntungan (%)', profitMargin.toFixed(1)],
        [''],
        ['PRODUK TERLARIS'],
        ['Nama Produk', 'Unit Terjual', 'Pendapatan'],
        ...topProducts.map(product => [product.name, product.sold, product.revenue]),
        [''],
        ['PERFORMA KATEGORI'],
        ['Kategori', 'Penjualan', 'Keuntungan', 'Persentase'],
        ...categoryPerformance.map(cat => [cat.name, cat.sales, cat.profit, cat.percentage + '%']),
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-penjualan-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    toast({
      title: "Export berhasil",
      description: `Laporan ${type} berhasil diunduh!`,
    });
  };

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Laporan Bisnis
          </CardTitle>
          <CardDescription>
            Analisis performa dan laporan keuangan toko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Periode Laporan</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="quarter">Kuartal Ini</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <>
                <div>
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tanggal Akhir</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 items-end">
              <Button variant="outline" onClick={() => handleExportReport('PDF')}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('Excel')}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% dari periode sebelumnya
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keuntungan</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalProfit)}
            </div>
            <p className="text-xs text-slate-600">
              Margin: {profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalTransactions}
            </div>
            <p className="text-xs text-slate-600">
              {(totalTransactions / 7).toFixed(1)} transaksi/hari
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(averageTransaction)}
            </div>
            <p className="text-xs text-slate-600">
              Per transaksi
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Laporan Harian</TabsTrigger>
          <TabsTrigger value="products">Analisis Produk</TabsTrigger>
          <TabsTrigger value="trends">Tren Bulanan</TabsTrigger>
          <TabsTrigger value="profit">Analisis Keuntungan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan Harian</CardTitle>
                <CardDescription>
                  Grafik pendapatan per hari dalam periode yang dipilih
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Pendapatan']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jumlah Transaksi</CardTitle>
                <CardDescription>
                  Grafik jumlah transaksi per hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Transaksi']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
                <CardDescription>
                  Top 5 produk dengan penjualan tertinggi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {product.sold} unit terjual
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                        <p className="text-sm text-green-600">
                          Profit: {formatCurrency(product.profit)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performa Kategori</CardTitle>
                <CardDescription>
                  Distribusi penjualan berdasarkan kategori produk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieChartColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Persentase']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {categoryPerformance.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: pieChartColors[index] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.sales)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tren Penjualan Bulanan</CardTitle>
              <CardDescription>
                Perbandingan pendapatan dan keuntungan bulanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      formatCurrency(value), 
                      name === 'revenue' ? 'Pendapatan' : 'Keuntungan'
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" name="revenue" radius={4} />
                  <Bar dataKey="profit" fill="#10b981" name="profit" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analisis Keuntungan Harian</CardTitle>
                <CardDescription>
                  Grafik keuntungan bersih per hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Keuntungan']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margin Keuntungan</CardTitle>
                <CardDescription>
                  Persentase margin keuntungan per kategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPerformance.map((category, index) => {
                    const margin = (category.profit / category.sales) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-green-600">{margin.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${margin}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>Pendapatan: {formatCurrency(category.sales)}</span>
                          <span>Profit: {formatCurrency(category.profit)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPanel;
