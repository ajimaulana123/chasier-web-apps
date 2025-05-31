
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Moon, 
  Sun, 
  Save, 
  Database,
  Shield,
  Bell,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [storeName, setStoreName] = useState('Toko Saya');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const { toast } = useToast();

  // Check for existing dark mode preference
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: "Berhasil",
      description: `Mode ${checked ? 'gelap' : 'terang'} telah diaktifkan`,
    });
  };

  const handleExportData = async () => {
    try {
      // Mock data untuk demo
      const data = {
        products: [],
        transactions: [],
        customers: [],
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Berhasil",
        description: "Data berhasil diekspor",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengekspor data",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const data = JSON.parse(result);
          console.log('Imported data:', data);
          toast({
            title: "Berhasil",
            description: "Data berhasil diimpor",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Format file tidak valid",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Berhasil",
      description: "Pengaturan telah disimpan",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Kelola preferensi dan konfigurasi toko Anda
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pengaturan Toko */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Informasi Toko
            </CardTitle>
            <CardDescription>
              Konfigurasi dasar informasi toko
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Masukkan nama toko"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Alamat</Label>
              <Input
                id="storeAddress"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="Masukkan alamat toko"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone">Nomor Telepon</Label>
              <Input
                id="storePhone"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Simpan Informasi Toko
            </Button>
          </CardContent>
        </Card>

        {/* Pengaturan Tampilan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Pengaturan Tampilan
            </CardTitle>
            <CardDescription>
              Kustomisasi tampilan aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Gelap</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Aktifkan tema gelap
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifikasi</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Terima notifikasi sistem
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Otomatis</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Backup data secara otomatis
                </p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup & Restore
            </CardTitle>
            <CardDescription>
              Kelola cadangan data toko Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Ekspor Data
              </Button>
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full pointer-events-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Impor Data
                </Button>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-400">
                <Shield className="h-4 w-4 inline mr-1" />
                Backup data Anda secara berkala untuk menghindari kehilangan data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Sistem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Statistik Sistem
            </CardTitle>
            <CardDescription>
              Informasi tentang penggunaan sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">1,234</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Produk</p>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">5,678</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Transaksi</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Penggunaan Storage</span>
                <Badge variant="secondary">45%</Badge>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;
