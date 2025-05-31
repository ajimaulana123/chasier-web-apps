
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Minus, ShoppingCart, Search, Trash2, Calculator, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SalesInterface = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      code: 'IDM001',
      name: 'Indomie Goreng',
      price: 3000,
      stock: 45,
      category: 'Makanan',
    },
    {
      id: 2,
      code: 'AQU001',
      name: 'Aqua 600ml',
      price: 5000,
      stock: 8,
      category: 'Minuman',
    },
    {
      id: 3,
      code: 'ROK001',
      name: 'Gudang Garam Merah',
      price: 25000,
      stock: 25,
      category: 'Rokok',
    },
    {
      id: 4,
      code: 'SAB001',
      name: 'Sabun Lifebuoy',
      price: 12000,
      stock: 15,
      category: 'Kebersihan',
    },
    {
      id: 5,
      code: 'TEH001',
      name: 'Teh Botol Sosro',
      price: 5000,
      stock: 30,
      category: 'Minuman',
    },
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stok tidak cukup",
          description: `Stok ${product.name} hanya tersisa ${product.stock}`,
          variant: "destructive",
        });
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const product = products.find(p => p.id === id);
    if (newQuantity > product.stock) {
      toast({
        title: "Stok tidak cukup",
        description: `Stok ${product.name} hanya tersisa ${product.stock}`,
        variant: "destructive",
      });
      return;
    }

    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscountAmount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount();
  };

  const processTransaction = () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Silakan tambahkan produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmTransaction = () => {
    // Kurangi stok produk
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);

    const transaction = {
      id: Date.now(),
      items: [...cart],
      subtotal: calculateSubtotal(),
      discount: discount,
      discountAmount: calculateDiscountAmount(),
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      timestamp: new Date(),
    };

    setLastTransaction(transaction);
    setCart([]);
    setDiscount(0);
    setPaymentMethod('cash');
    setIsConfirmOpen(false);
    setIsReceiptOpen(true);

    toast({
      title: "Transaksi berhasil",
      description: `Total: Rp ${calculateTotal().toLocaleString()}`,
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Pilih Produk
            </CardTitle>
            <CardDescription>
              Cari dan tambahkan produk ke keranjang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari produk atau kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {product.code}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Stok: {product.stock} | Kategori: {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        Rp {product.price.toLocaleString()}
                      </p>
                      <Button size="sm" className="mt-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Tidak ada produk yang ditemukan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping Cart */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </span>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Keranjang masih kosong
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkout */}
        {cart.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Diskon (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="debit">Kartu Debit</SelectItem>
                    <SelectItem value="credit">Kartu Kredit</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {calculateSubtotal().toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({discount}%)</span>
                    <span>-Rp {calculateDiscountAmount().toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>Rp {calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full" onClick={processTransaction}>
                <Receipt className="h-4 w-4 mr-2" />
                Proses Transaksi
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Transaction Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin memproses transaksi dengan total{' '}
              <strong>Rp {calculateTotal().toLocaleString()}</strong>?
              <br />
              Stok produk akan berkurang secara otomatis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTransaction}>
              Proses Transaksi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Struk Pembayaran</DialogTitle>
            <DialogDescription>
              Transaksi berhasil diproses
            </DialogDescription>
          </DialogHeader>
          {lastTransaction && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold">TOKO SERBAADA</h3>
                <p className="text-sm text-slate-600">Jl. Contoh No. 123</p>
                <p className="text-xs text-slate-500">
                  {lastTransaction.timestamp.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="space-y-2">
                {lastTransaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <div>{item.name}</div>
                      <div className="text-slate-500">
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      Rp {(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {lastTransaction.subtotal.toLocaleString()}</span>
                </div>
                {lastTransaction.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({lastTransaction.discount}%)</span>
                    <span>-Rp {lastTransaction.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total</span>
                  <span>Rp {lastTransaction.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Pembayaran</span>
                  <span className="capitalize">{lastTransaction.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsReceiptOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesInterface;
