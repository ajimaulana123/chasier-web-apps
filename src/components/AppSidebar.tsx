
import { Home, Package, ShoppingCart, Users, FileText, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    id: 'dashboard',
  },
  {
    title: 'Produk',
    icon: Package,
    id: 'products',
  },
  {
    title: 'Penjualan',
    icon: ShoppingCart,
    id: 'sales',
  },
  {
    title: 'Pelanggan',
    icon: Users,
    id: 'customers',
  },
  {
    title: 'Laporan',
    icon: FileText,
    id: 'reports',
  },
  {
    title: 'Pengaturan',
    icon: Settings,
    id: 'settings',
  },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Admin POS
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sistem Manajemen Toko
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-slate-500 dark:text-slate-400">
          © 2024 Admin POS System
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
