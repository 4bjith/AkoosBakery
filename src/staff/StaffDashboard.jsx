import { useState, useEffect } from 'react';
import { Users, ShoppingCart, Package, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { staffAPI } from '@/api/staffApi';
import api from '@/api/axios';

export default function StaffDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch real data from APIs
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real stats from multiple API endpoints
      const [customersRes, ordersRes, productsRes] = await Promise.all([
        // Fetch customers
        staffAPI.getCustomers().catch(() => ({ data: { data: { customers: [] } } })),
        // Fetch orders
        staffAPI.getOrders().catch(() => ({ data: { data: { orders: [] } } })),
        // Fetch products from the API
        api.get('/products').catch(() => ({ data: { data: { products: [] } } }))
      ]);
      
      const customersData = customersRes.data?.data || customersRes.data || {};
      const ordersData = ordersRes.data?.data || ordersRes.data || {};
      const productsData = productsRes.data?.data || productsRes.data || {};
      
      const customers = customersData.customers || [];
      const orders = ordersData.orders || [];
      const products = productsData.products || [];
      
      setCustomers(customers);
      setOrders(orders);
      setProducts(products);
      
      const dashboardStats = {
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        pendingOrders: orders.filter(order => order.status === 'Processing').length,
        completedOrders: orders.filter(order => order.status === 'Delivered').length,
      };
      
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Orders Placed',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'negative',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#2c2a29]">Staff Dashboard</h1>
        <p className="text-[#6b615a] mt-2">Welcome back, {user?.name}! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b615a] font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-[#2c2a29] mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-[#6b615a] ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
        <h2 className="text-lg font-semibold text-[#2c2a29] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-[#c79261]/10 rounded-lg text-center hover:bg-[#c79261]/20 transition-colors">
            <Users className="w-8 h-8 text-[#c79261] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2c2a29]">Add Customer</p>
          </button>
          <button className="p-4 bg-[#c79261]/10 rounded-lg text-center hover:bg-[#c79261]/20 transition-colors">
            <ShoppingCart className="w-8 h-8 text-[#c79261] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2c2a29]">Place Order</p>
          </button>
          <button className="p-4 bg-[#c79261]/10 rounded-lg text-center hover:bg-[#c79261]/20 transition-colors">
            <FileText className="w-8 h-8 text-[#c79261] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2c2a29]">View Invoices</p>
          </button>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2c2a29]">Active Products</h2>
          <button className="text-sm text-[#c79261] hover:text-[#c79261]/80 font-medium">
            View All Products
          </button>
        </div>
        <div className="space-y-3">
          {products.length > 0 ? (
            products.slice(0, 3).map((product, index) => (
              <div key={product._id} className="flex items-center justify-between p-4 bg-[#fdfbf9] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#c79261] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#2c2a29]">{product.name}</p>
                    <p className="text-sm text-[#6b615a]">{product.category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#2c2a29]">Rs. {product.price?.toLocaleString()}</p>
                  <p className="text-sm text-[#6b615a]">{product.stock || 'In Stock'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#6b615a] py-8">No products available</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#2c2a29]">Recent Orders</h2>
          <button className="text-sm text-[#c79261] hover:text-[#c79261]/80 font-medium">
            View All Orders
          </button>
        </div>
        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.slice(0, 3).map((order, index) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-[#fdfbf9] rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#c79261] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[#2c2a29]">Order #{order._id?.slice(-8)}</p>
                    <p className="text-sm text-[#6b615a]">{order.user?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#2c2a29]">Rs. {order.totalAmount?.toLocaleString()}</p>
                  <p className="text-sm text-[#6b615a]">{order.status}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#6b615a] py-8">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
}
