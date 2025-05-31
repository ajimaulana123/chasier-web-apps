
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Users, CreditCard, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('customers');

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Budi Santoso',
      phone: '08123456789',
      address: 'Jl. Merdeka No. 123',
      totalDebt: 150000,
      lastTransaction: '2024-01-15',
    },
    {
      id: 2,
      name: 'Siti Aminah',
      phone: '08234567890',
      address: 'Jl. Sudirman No. 456',
      totalDebt: 75000,
      lastTransaction: '2024-01-20',
    },
    {
      id: 3,
      name: 'Ahmad Wijaya',
      phone: '08345678901',
      address: 'Jl. Thamrin No. 789',
      totalDebt: 0,
      lastTransaction: '2024-01-25',
    },
  ]);

  const [creditTransactions, setCreditTransactions] = useState([
    {
      id: 1,
      customerId: 1,
      customerName: 'Budi Santoso',
      amount: 50000,
      description: 'Belanja bulanan',
      date: '2024-01-15',
      status: 'unpaid',
      dueDate: '2024-02-15',
    },
    {
      id: 2,
      customerId: 1,
      customerName: 'Budi Santoso',
      amount: 100000,
      description: 'Belanja mingguan',
      date: '2024-01-10',
      status: 'unpaid',
      dueDate: '2024-02-10',
    },
    {
      id: 3,
      customerId: 2,
      customerName: 'Siti Aminah',
      amount: 75000,
      description: 'Belanja harian',
      date: '2024-01-20',
      status: 'unpaid',
      dueDate: '2024-02-20',
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      customerId: 1,
      customerName: 'Budi Santoso',
      amount: 25000,
      date: '2024-01-22',
      note: 'Pembayaran sebagian',
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Siti Aminah',
      amount: 30000,
      date: '2024-01-23',
      note: 'Cicilan 1',
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [newPayment, setNewPayment] = useState({
    customerId: '',
    amount: '',
    note: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast({
        title: "Error",
        description: "Nama dan nomor telepon harus diisi!",
        variant: "destructive",
      });
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      address: newCustomer.address,
      totalDebt: 0,
      lastTransaction: new Date().toISOString().split('T')[0],
    };

    setCustomers([...customers, customer]);
    setNewCustomer({ name: '', phone: '', address: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Berhasil",
      description: "Pelanggan berhasil ditambahkan!",
    });
  };

  const handlePayment = () => {
    if (!newPayment.customerId || !newPayment.amount) {
      toast({
        title: "Error",
        description: "Pilih pelanggan dan masukkan jumlah pembayaran!",
        variant: "destructive",
      });
      return;
    }

    const customer = customers.find(c => c.id === parseInt(newPayment.customerId));
    const amount = parseInt(newPayment.amount);

    if (amount > customer.totalDebt) {
      toast({
        title: "Error",
        description: "Jumlah pembayaran melebihi total hutang!",
        variant: "destructive",
      });
      return;
    }

    const payment = {
      id: Date.now(),
      customerId: parseInt(newPayment.customerId),
      customerName: customer.name,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      note: newPayment.note,
    };

    setPayments([...payments, payment]);
    
    // Update customer debt
    setCustomers(customers.map(c => 
      c.id === parseInt(newPayment.customerId)
        ? { ...c, totalDebt: c.totalDebt - amount }
        : c
    ));

    setNewPayment({ customerId: '', amount: '', note: '' });
    
    toast({
      title: "Berhasil",
      description: "Pembayaran berhasil dicatat!",
    });
  };

  const getOverdueTransactions = () => {
    const today = new Date();
    return creditTransactions.filter(transaction => {
      const dueDate = new Date(transaction.dueDate);
      return dueDate < today && transaction.status === 'unpaid';
    });
  };

  const getTotalDebt = () => {
    return customers.reduce((total, customer) => total + customer.totalDebt, 0);
  };

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-slate-600">Pelanggan terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Piutang</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalDebt())}</div>
            <p className="text-xs text-slate-600">Total hutang pelanggan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Jatuh Tempo</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{getOverdueTransactions().length}</div>
            <p className="text-xs text-slate-600">Perlu perhatian</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Data Pelanggan</TabsTrigger>
          <TabsTrigger value="credit">Piutang</TabsTrigger>
          <TabsTrigger value="payments">Pembayaran</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manajemen Pelanggan
              </CardTitle>
              <CardDescription>
                Kelola data pelanggan dan informasi kontak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cari pelanggan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Pelanggan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                      <DialogDescription>
                        Masukkan informasi pelanggan baru
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                          placeholder="Nama pelanggan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          placeholder="08123456789"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Input
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                          placeholder="Alamat lengkap"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddCustomer}>
                        Tambah Pelanggan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Total Hutang</TableHead>
                      <TableHead>Transaksi Terakhir</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="max-w-48 truncate">
                          {customer.address}
                        </TableCell>
                        <TableCell>
                          <span className={customer.totalDebt > 0 ? 'text-orange-600 font-medium' : 'text-green-600'}>
                            {formatCurrency(customer.totalDebt)}
                          </span>
                        </TableCell>
                        <TableCell>{customer.lastTransaction}</TableCell>
                        <TableCell>
                          {customer.totalDebt > 0 ? (
                            <Badge variant="destructive">Ada Hutang</Badge>
                          ) : (
                            <Badge variant="default">Lunas</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Manajemen Piutang
              </CardTitle>
              <CardDescription>
                Kelola transaksi kredit dan piutang pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditTransactions.map((transaction) => {
                      const isOverdue = new Date(transaction.dueDate) < new Date() && transaction.status === 'unpaid';
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.customerName}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className={isOverdue ? 'text-red-600' : ''}>
                            {transaction.dueDate}
                            {isOverdue && (
                              <Clock className="h-4 w-4 inline ml-1" />
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'paid' ? (
                              <Badge variant="default">Lunas</Badge>
                            ) : isOverdue ? (
                              <Badge variant="destructive">Jatuh Tempo</Badge>
                            ) : (
                              <Badge variant="secondary">Belum Lunas</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Pembayaran</CardTitle>
                  <CardDescription>
                    Daftar pembayaran yang telah diterima
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pelanggan</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Keterangan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.customerName}
                            </TableCell>
                            <TableCell className="text-green-600 font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.note}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Catat Pembayaran</CardTitle>
                <CardDescription>
                  Tambah pembayaran baru dari pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pelanggan</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newPayment.customerId}
                    onChange={(e) => setNewPayment({...newPayment, customerId: e.target.value})}
                  >
                    <option value="">Pilih pelanggan</option>
                    {customers.filter(c => c.totalDebt > 0).map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {formatCurrency(customer.totalDebt)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah Pembayaran</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Keterangan</Label>
                  <Input
                    id="note"
                    value={newPayment.note}
                    onChange={(e) => setNewPayment({...newPayment, note: e.target.value})}
                    placeholder="Keterangan pembayaran"
                  />
                </div>
                <Button className="w-full" onClick={handlePayment}>
                  Catat Pembayaran
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;
