
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import DashboardPanel from '@/components/DashboardPanel';
import ProductManagement from '@/components/ProductManagement';
import SalesInterface from '@/components/SalesInterface';
import CustomerManagement from '@/components/CustomerManagement';
import ReportsPanel from '@/components/ReportsPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPanel />;
      case 'products':
        return <ProductManagement />;
      case 'sales':
        return <SalesInterface />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'products' && 'Manajemen Produk'}
                  {activeTab === 'sales' && 'Penjualan'}
                  {activeTab === 'customers' && 'Manajemen Pelanggan'}
                  {activeTab === 'reports' && 'Laporan'}
                  {activeTab === 'settings' && 'Pengaturan'}
                </h1>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
              {renderContent()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
