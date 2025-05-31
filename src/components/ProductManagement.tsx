import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      code: 'IDM001',
      name: 'Indomie Goreng',
      category: 'Makanan',
      purchasePrice: 2500,
      sellingPrice: 3000,
      stock: 45,
      unit: 'pcs',
      minStock: 20,
    },
    {
      id: 2,
      code: 'AQU001',
      name: 'Aqua 600ml',
      category: 'Minuman',
      purchasePrice: 3000,
      sellingPrice: 5000,
      stock: 8,
      unit: 'botol',
      minStock: 15,
    },
    {
      id: 3,
      code: 'ROK001',
      name: 'Gudang Garam Merah',
      category: 'Rokok',
      purchasePrice: 22000,
      sellingPrice: 25000,
      stock: 25,
      unit: 'bungkus',
      minStock: 10,
    },
    {
      id: 4,
      code: 'SAB001',
      name: 'Sabun Lifebuoy',
      category: 'Kebersihan',
      purchasePrice: 8000,
      sellingPrice: 12000,
      stock: 15,
      unit: 'pcs',
      minStock: 8,
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    unit: '',
    minStock: '',
  });

  const categories = ['Makanan', 'Minuman', 'Rokok', 'Kebersihan', 'Lainnya'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.code) {
      toast({
        title: "Error",
        description: "Nama dan kode produk harus diisi!",
        variant: "destructive",
      });
      return;
    }

    const product = {
      id: Date.now(),
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      purchasePrice: parseInt(newProduct.purchasePrice) || 0,
      sellingPrice: parseInt(newProduct.sellingPrice) || 0,
      stock: parseInt(newProduct.stock) || 0,
      unit: newProduct.unit,
      minStock: parseInt(newProduct.minStock) || 0,
    };

    setProducts([...products, product]);
    setNewProduct({
      code: '',
      name: '',
      category: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      unit: '',
      minStock: '',
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Berhasil",
      description: "Produk berhasil ditambahkan!",
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      code: product.code,
      name: product.name,
      category: product.category,
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      minStock: product.minStock.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.code) {
      toast({
        title: "Error",
        description: "Nama dan kode produk harus diisi!",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      code: newProduct.code,
      name: newProduct.name,
      category: newProduct.category,
      purchasePrice: parseInt(newProduct.purchasePrice) || 0,
      sellingPrice: parseInt(newProduct.sellingPrice) || 0,
      stock: parseInt(newProduct.stock) || 0,
      unit: newProduct.unit,
      minStock: parseInt(newProduct.minStock) || 0,
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setNewProduct({
      code: '',
      name: '',
      category: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      unit: '',
      minStock: '',
    });
    setEditingProduct(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Berhasil",
      description: "Produk berhasil diperbarui!",
    });
  };

  const handleDeleteProduct = (id, productName) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Berhasil",
      description: `Produk ${productName} berhasil dihapus!`,
    });
  };

  const calculateProfit = (product) => {
    return product.sellingPrice - product.purchasePrice;
  };

  const isLowStock = (product) => {
    return product.stock <= product.minStock;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manajemen Produk
          </CardTitle>
          <CardDescription>
            Kelola produk dan inventori toko Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari produk atau kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tambah Produk Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi produk yang akan ditambahkan
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Kode Produk</Label>
                      <Input
                        id="code"
                        value={newProduct.code}
                        onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                        placeholder="IDM001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Produk</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Nama produk"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Satuan</Label>
                      <Input
                        id="unit"
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        placeholder="pcs, botol, kg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Harga Beli</Label>
                      <Input
                        id="purchasePrice"
                        type="number"
                        value={newProduct.purchasePrice}
                        onChange={(e) => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Harga Jual</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        value={newProduct.sellingPrice}
                        onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stok Awal</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Stok Minimum</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleAddProduct}>
                    Tambah Produk
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Produk</DialogTitle>
                <DialogDescription>
                  Perbarui informasi produk
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-code">Kode Produk</Label>
                    <Input
                      id="edit-code"
                      value={newProduct.code}
                      onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                      placeholder="IDM001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nama Produk</Label>
                    <Input
                      id="edit-name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Nama produk"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Kategori</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit">Satuan</Label>
                    <Input
                      id="edit-unit"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      placeholder="pcs, botol, kg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-purchasePrice">Harga Beli</Label>
                    <Input
                      id="edit-purchasePrice"
                      type="number"
                      value={newProduct.purchasePrice}
                      onChange={(e) => setNewProduct({...newProduct, purchasePrice: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sellingPrice">Harga Jual</Label>
                    <Input
                      id="edit-sellingPrice"
                      type="number"
                      value={newProduct.sellingPrice}
                      onChange={(e) => setNewProduct({...newProduct, sellingPrice: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Stok</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minStock">Stok Minimum</Label>
                    <Input
                      id="edit-minStock"
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdateProduct}>
                  Perbarui Produk
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Product Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga Beli</TableHead>
                  <TableHead>Harga Jual</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">
                      {product.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      Rp {product.purchasePrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      Rp {product.sellingPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      Rp {calculateProfit(product).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isLowStock(product) && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        <span className={isLowStock(product) ? 'text-orange-600 font-medium' : ''}>
                          {product.stock} {product.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isLowStock(product) ? (
                        <Badge variant="destructive">Stok Rendah</Badge>
                      ) : (
                        <Badge variant="default">Normal</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus produk "{product.name}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Tidak ada produk yang ditemukan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
