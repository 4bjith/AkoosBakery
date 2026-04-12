import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, 
  RefreshCw, Activity,
  Clock, CheckCircle, Truck, XCircle, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { analyticsAPI } from '@/api/analyticsApi';
import { toast } from 'sonner';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chart specific states
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [chartLoading, setChartLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsAPI.getDashboardStats();
      setStats(data.data);
    } catch (err) {
      toast.error('Failed to load system analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async () => {
    setChartLoading(true);
    try {
      const { data } = await analyticsAPI.getRevenueChart(chartPeriod);
      setChartData(data.data || []);
    } catch (err) {
      toast.error('Failed to load chart data');
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchChart();
  }, [chartPeriod]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-[#c79261]" />
        <p className="text-[#6b615a] font-medium animate-pulse">Compiling real-time business analytics...</p>
      </div>
    );
  }

  const s = stats || { users: {}, products: {}, orders: {}, sales: {} };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2a29] tracking-tight">System Analytics</h1>
          <p className="text-[#6b615a] mt-1 text-sm font-medium">Real-time breakdown of B2B operations and health.</p>
        </div>
        <button onClick={fetchStats} className="flex items-center gap-2 text-sm font-medium text-[#c79261] hover:text-[#b58150] transition-colors p-2 bg-[#fdfbf9] rounded-lg border border-[#f0e9e1] cursor-pointer">
          <RefreshCw className="w-4 h-4" /> Sync Data
        </button>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f0e9e1] transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#c79261]/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-[#c79261]" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <div>
            <p className="text-[#6b615a] text-sm font-semibold mb-1 uppercase tracking-wider">Total Sales Flow</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">₹{s.sales?.totalRevenue?.toLocaleString() || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f0e9e1] transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-blue-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-[#6b615a] bg-gray-100 px-2 py-1 rounded-full">
              Volume
            </span>
          </div>
          <div>
             <p className="text-[#6b615a] text-sm font-semibold mb-1 uppercase tracking-wider">Gross Orders</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">{s.orders?.total || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f0e9e1] transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="text-[#6b615a] text-sm font-semibold mb-1 uppercase tracking-wider">Total Ecosystem Users</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">{s.users?.total || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f0e9e1] transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <p className="text-[#6b615a] text-sm font-semibold mb-1 uppercase tracking-wider">Marketplace Products</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">{s.products?.total || 0}</h3>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f0e9e1]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-[#2c2a29] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#c79261]" /> Revenue Index
          </h3>
          <div className="flex bg-[#fdfbf9] p-1 rounded-lg border border-[#f0e9e1]">
            <button 
              onClick={() => setChartPeriod('weekly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${chartPeriod === 'weekly' ? 'bg-[#c79261] text-white shadow-sm' : 'text-[#6b615a] hover:text-[#2c2a29]'}`}
            >Weekly</button>
            <button 
              onClick={() => setChartPeriod('monthly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${chartPeriod === 'monthly' ? 'bg-[#c79261] text-white shadow-sm' : 'text-[#6b615a] hover:text-[#2c2a29]'}`}
            >Monthly</button>
            <button 
              onClick={() => setChartPeriod('yearly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${chartPeriod === 'yearly' ? 'bg-[#c79261] text-white shadow-sm' : 'text-[#6b615a] hover:text-[#2c2a29]'}`}
            >Yearly</button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center">
               <RefreshCw className="w-8 h-8 animate-spin text-[#c79261]/50" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#6b615a]">
               No revenue data found for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c79261" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c79261" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e1" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#6b615a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b615a', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2c2a29', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#c79261' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c79261" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Segmented Deep Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders Segmentation */}
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] shadow-sm">
          <h3 className="text-lg font-bold text-[#2c2a29] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#c79261]" /> Fulfillment Pipeline
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0e9e1] pb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-[#6b615a]">Processing</span>
              </div>
              <span className="text-lg font-bold text-[#2c2a29]">{s.orders?.processing || 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#f0e9e1] pb-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-[#6b615a]">Shipped</span>
              </div>
              <span className="text-lg font-bold text-[#2c2a29]">{s.orders?.shipped || 0}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#f0e9e1] pb-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-[#6b615a]">Delivered</span>
              </div>
              <span className="text-lg font-bold text-[#2c2a29]">{s.orders?.delivered || 0}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-[#6b615a]">Cancelled</span>
              </div>
              <span className="text-lg font-bold text-[#2c2a29]">{s.orders?.cancelled || 0}</span>
            </div>
          </div>
        </div>

        {/* Products Segmentation */}
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] shadow-sm">
          <h3 className="text-lg font-bold text-[#2c2a29] mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#c79261]" /> Catalog Health
          </h3>
          <div className="flex flex-col h-[calc(100%-3rem)] justify-center space-y-6">
             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-emerald-800 text-sm font-bold uppercase tracking-wider mb-1">Active SKUs</p>
                   <p className="text-emerald-600 text-xs font-medium">Visible to B2B Buyers</p>
                </div>
                <span className="text-3xl font-black text-emerald-700 relative z-10">{s.products?.active || 0}</span>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center">
                <div>
                   <p className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-1">Inactive / Drafts</p>
                   <p className="text-gray-500 text-xs font-medium">Hidden from catalogs</p>
                </div>
                <span className="text-3xl font-black text-gray-700">{s.products?.inactive || 0}</span>
             </div>
          </div>
        </div>

        {/* User Engagement Segmentation */}
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] shadow-sm">
          <h3 className="text-lg font-bold text-[#2c2a29] mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#c79261]" /> Account Penetration
          </h3>
          <div className="relative h-48 flex items-center justify-center">
             <div className="absolute inset-0 m-auto w-40 h-40 rounded-full border-[16px] border-[#c79261]/20 flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-xs font-bold text-[#6b615a] uppercase">Active Users</p>
                    <p className="text-3xl font-black text-[#2c2a29]">{s.users?.active || 0}</p>
                 </div>
             </div>
          </div>
          <div className="mt-4 flex justify-between items-center border-t border-[#f0e9e1] pt-4 text-sm font-medium text-[#6b615a]">
            <span>Total Accounts: <strong className="text-[#2c2a29]">{s.users?.total || 0}</strong></span>
            <span>Inactive/Banned: <strong className="text-red-500">{s.users?.inactive || 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
