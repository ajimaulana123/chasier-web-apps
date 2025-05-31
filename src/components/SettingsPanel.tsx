
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Download, Upload, Database, Store, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPanel = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: false,
    newCustomer: true,
    paymentReminder: true,
  });
  const [storeInfo, setStoreInfo] = useState({
    name: 'Toko Serbaada',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '021-12345678',
    email: 'toko@serbaada.com',
  });
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const handleExportData = () => {
    // Simulate data export
    const data = {
      products: [],
      customers: [],
      transactions: [],
      settings: storeInfo,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsBackupDialogOpen(false);
    toast({
      title: "Backup berhasil",
      description: "Data berhasil dibackup ke file JSON",
    });
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        console.log('Imported data:', data);
        
        setIsRestoreDialogOpen(false);
        toast({
          title: "Restore berhasil",
          description: "Data berhasil dipulihkan dari backup",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "File backup tidak valid",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleStoreInfoUpdate = () => {
    toast({
      title: "Berhasil",
      description: "Informasi toko berhasil diperbarui",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: "Mode tampilan berubah",
      description: isDarkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Pengaturan Sistem
          </CardTitle>
          <CardDescription>
            Kelola pengaturan toko dan sistem POS
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Info Toko</TabsTrigger>
          <TabsTrigger value="appearance">Tampilan</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="backup">Data Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informasi Toko
              </CardTitle>
              <CardDescription>
                Kelola informasi dasar tentang toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nama Toko</Label>
                  <Input
                    id="storeName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                    placeholder="Nama toko"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Nomor Telepon</Label>
                  <Input
                    id="storePhone"
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                    placeholder="Nomor telepon"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Alamat</Label>
                <Input
                  id="storeAddress"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                  placeholder="Alamat lengkap toko"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                  placeholder="Email toko"
                />
              </div>
              <Button onClick={handleStoreInfoUpdate}>
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Pengaturan Tampilan
              </CardTitle>
              <CardDescription>
                Sesuaikan tampilan dan tema aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">Mode Gelap</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Beralih antara tema terang dan gelap
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Pratinjau Tema</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-blue-500 rounded w-16"></div>
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 font-medium">Tema Terang</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-slate-900">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-blue-400 rounded w-16"></div>
                        <div className="h-6 bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 font-medium text-white">Tema Gelap</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola notifikasi dan peringatan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Peringatan Stok Rendah</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Dapatkan notifikasi ketika stok produk menipis
                    </p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, lowStock: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Laporan Harian</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Terima ringkasan penjualan harian
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, dailyReport: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Pelanggan Baru</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Notifikasi saat ada pelanggan baru terdaftar
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newCustomer}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, newCustomer: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Pengingat Pembayaran</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Peringatan untuk piutang yang jatuh tempo
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentReminder}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, paymentReminder: checked})
                    }
                  />
                </div>
              </div>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Notifikasi akan ditampilkan sebagai toast message di aplikasi. 
                  Untuk notifikasi email, silakan hubungi administrator sistem.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Data
                </CardTitle>
                <CardDescription>
                  Buat backup data untuk keamanan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Backup akan menyimpan semua data produk, pelanggan, transaksi, dan pengaturan dalam format JSON.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Backup Manual</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Unduh file backup yang berisi semua data toko
                    </p>
                    <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Buat Backup
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Backup</DialogTitle>
                          <DialogDescription>
                            Apakah Anda yakin ingin membuat backup data? 
                            File backup akan diunduh ke perangkat Anda.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button onClick={handleExportData}>
                            Ya, Buat Backup
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-xs text-slate-500">
                    <p>Backup terakhir: Belum pernah</p>
                    <p>Disarankan untuk backup data secara berkala</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Restore Data
                </CardTitle>
                <CardDescription>
                  Pulihkan data dari file backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peringatan:</strong> Restore akan mengganti semua data yang ada. 
                    Pastikan untuk backup data saat ini terlebih dahulu.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Upload File Backup</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Pilih file backup JSON untuk dipulihkan
                    </p>
                    <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Pilih File Backup
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restore Data</DialogTitle>
                          <DialogDescription>
                            Pilih file backup JSON untuk dipulihkan. 
                            Proses ini akan mengganti semua data yang ada.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                            Batal
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-xs text-slate-500">
                    <p>Format yang didukung: JSON</p>
                    <p>Ukuran maksimal: 10MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;
