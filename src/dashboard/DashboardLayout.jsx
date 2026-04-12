import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Clock, ScrollText, LogOut, Croissant, User, Menu, X, MessageSquare } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Products Catalog', path: '/dashboard/products', icon: Package },
    { name: 'Current Order / Cart', path: '/dashboard/cart', icon: ShoppingCart },
    { name: 'Order History', path: '/dashboard/orders', icon: Clock },
    { name: 'Admin Support', path: '/dashboard/support', icon: MessageSquare },
  ];

  return (
    <div className="fixed inset-0 bg-[#fdfbf9] flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#f0e9e1] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Croissant className="w-6 h-6 text-[#c79261]" />
          <span className="font-bold text-[#2c2a29]">Akoos B2B</span>
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
            <Croissant className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#2c2a29] leading-tight">Akoos Bakery</h1>
            <p className="text-[10px] uppercase tracking-wider text-[#6b615a] font-semibold">B2B Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-xs font-semibold text-[#6b615a] uppercase tracking-wider mb-4 px-2">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#c79261]/10 text-[#c79261]'
                    : 'text-[#6b615a] hover:bg-[#f5ebe2] hover:text-[#2c2a29]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#c79261]' : ''}`} />
                  {item.name}
                </div>
                {item.name === 'Current Order / Cart' && getCartCount() > 0 && (
                  <span className="bg-[#c79261] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#f0e9e1]">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6b615a] hover:bg-[#f5ebe2] hover:text-[#2c2a29] transition-all mb-1"
          >
            <User className="w-4 h-4" />
            My Profile
          </Link>
          <button
            onClick={() => logout().then(() => window.location.href = '/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
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
