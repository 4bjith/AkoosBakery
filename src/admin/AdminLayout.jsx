import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Menu, X, ShieldCheck, FolderTree, PackageOpen, TrendingUp } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders Mgt.', path: '/admin/orders', icon: PackageOpen },
    { name: 'Categories Mgt.', path: '/admin/categories', icon: FolderTree },
    { name: 'Products Mgt.', path: '/admin/products', icon: Package },
    { name: 'User Mgt.', path: '/admin/users', icon: Users },
    { name: 'Sales Report', path: '/admin/sales', icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 bg-[#fdfbf9] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#f0e9e1] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#c79261]" />
          <span className="font-bold text-[#2c2a29]">Admin Core</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#2c2a29]">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#f0e9e1] shadow-xl shadow-black/5 z-40 transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-[#f0e9e1]">
          <div className="w-10 h-10 bg-[#c79261] rounded-xl flex items-center justify-center shadow-lg shadow-[#c79261]/25">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#2c2a29] leading-tight">Akoos Core</h1>
            <p className="text-[10px] uppercase tracking-wider text-[#6b615a] font-semibold">Super Admin</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-xs font-semibold text-[#6b615a] uppercase tracking-wider mb-4 px-2">Management</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#c79261]/10 text-[#c79261]'
                    : 'text-[#6b615a] hover:bg-[#f5ebe2] hover:text-[#2c2a29]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#f0e9e1]">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-[#fdfbf9] border border-[#f0e9e1] text-sm">
            <div className="w-8 h-8 rounded-full bg-[#c79261] flex items-center justify-center text-white font-bold text-xs uppercase">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[#2c2a29] font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-[#6b615a] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout().then(() => window.location.href = '/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
