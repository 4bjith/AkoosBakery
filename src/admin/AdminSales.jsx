import { useState, useEffect } from 'react';
import { 
  TrendingUp, IndianRupee, PieChart, BarChart3, 
  Download, Printer, Search, RefreshCw, X, 
  FileText, Calendar, Filter, User
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { analyticsAPI } from '@/api/analyticsApi';
import { userAPI } from '@/api/userApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AdminSales() {
  const [salesStats, setSalesStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('monthly');
  
  // Date Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // User specific reporting states
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userReport, setUserReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [fetchingReport, setFetchingReport] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: stats }, { data: chart }, { data: usersData }] = await Promise.all([
        analyticsAPI.getSalesStats(),
        analyticsAPI.getRevenueChart(chartPeriod),
        userAPI.getAllUsers()
      ]);
      setSalesStats(stats.data);
      setChartData(chart.data);
      setUsers(usersData.data.users);
    } catch (err) {
      toast.error('Failed to sync financial ecosystem');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chartPeriod]);

  const handleGenerateUserReport = async () => {
    if (!selectedUserId) {
        toast.warning("Please select a user to analyze.");
        return;
    }
    setFetchingReport(true);
    try {
        const params = {};
        if (fromDate) params.startDate = fromDate;
        if (toDate) params.endDate = toDate;

        const { data } = await analyticsAPI.getUserSalesReport(selectedUserId, params);
        setUserReport(data.data);
        setIsReportModalOpen(true);
    } catch (err) {
        toast.error('Failed to generate purchase report');
    } finally {
        setFetchingReport(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!userReport || userReport.orders.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    
    const userName = users.find(u => u._id === selectedUserId)?.name || "User";
    const headers = ['Order_ID', 'Date', 'Status', 'Payment_Method', 'Total_Amount', 'Tax_Amount'];
    const rows = userReport.orders.map(o => [
      `INV-${o._id.slice(-6).toUpperCase()}`,
      new Date(o.createdAt).toLocaleDateString(),
      o.status,
      o.paymentMethod,
      o.totalAmount,
      o.taxAmount
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SalesAudit_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Ledger exported successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-[#c79261]" />
        <p className="text-[#6b615a] font-medium animate-pulse">Aggregating transactional data and revenue streams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2a29] tracking-tight flex items-center gap-3">
             <div className="p-2 bg-[#c79261]/10 rounded-xl">
                <TrendingUp className="w-8 h-8 text-[#c79261]" />
             </div>
             Revenue Insights
          </h1>
          <p className="text-[#6b615a] mt-1 text-sm font-medium">Global sales metrics, tax distribution, and order efficiency.</p>
        </div>
        
        {/* User Picker & Date Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-3xl border border-[#f0e9e1] shadow-sm w-full xl:w-auto">
            <div className="flex flex-col flex-1 w-full">
                <span className="text-[10px] font-black uppercase text-[#6b615a] ml-1 mb-1">Fiscal Registry Audit</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-1">
                        <select 
                            className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">Select Account...</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input 
                            type="date" 
                            className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2 text-sm outline-none"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="date" 
                            className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2 text-sm outline-none"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={handleGenerateUserReport} 
                        disabled={fetchingReport}
                        className="bg-[#c79261] hover:bg-[#b58150] rounded-xl px-6 h-11 shadow-lg shadow-[#c79261]/20 font-bold"
                    >
                        {fetchingReport ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                        Run Audit
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] relative overflow-hidden group transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <IndianRupee className="w-20 h-20" />
            </div>
            <p className="text-[#6b615a] text-xs font-black uppercase tracking-widest mb-1">Gross Revenue</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">₹{salesStats?.totalRevenue?.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                <RefreshCw className="w-3 h-3" /> Real-time Value
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] relative overflow-hidden group transition-transform hover:-translate-y-1">
            <p className="text-[#6b615a] text-xs font-black uppercase tracking-widest mb-1">Avg. Order Value</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">₹{Math.round(salesStats?.avgOrderValue || 0).toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-indigo-600 text-[10px] font-bold uppercase">
                Per checkout efficiency
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] relative overflow-hidden group transition-transform hover:-translate-y-1">
            <p className="text-[#6b615a] text-xs font-black uppercase tracking-widest mb-1">Tax Accrued (GST)</p>
            <h3 className="text-3xl font-black text-[#c79261]">₹{salesStats?.totalTax?.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-[#6b615a] text-[10px] font-bold uppercase">
                Estimated collection
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] relative overflow-hidden group transition-transform hover:-translate-y-1">
            <p className="text-[#6b615a] text-xs font-black uppercase tracking-widest mb-1">Units Distributed</p>
            <h3 className="text-3xl font-black text-[#2c2a29]">{salesStats?.totalItems?.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-amber-600 text-[10px] font-bold uppercase">
                Inventory velocity
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
          {/* Revenue Over Time Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#f0e9e1] shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-xl font-black text-[#2c2a29] uppercase tracking-tight">Temporal Growth</h3>
                    <p className="text-xs text-[#6b615a]">Revenue scaling across {chartPeriod} buckets.</p>
                </div>
                <div className="flex bg-[#fdfbf9] p-1.5 rounded-xl border border-[#f0e9e1]">
                    {['weekly', 'monthly', 'yearly'].map(p => (
                        <button 
                            key={p}
                            onClick={() => setChartPeriod(p)}
                            className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${chartPeriod === p ? 'bg-[#c79261] text-white' : 'text-[#6b615a] hover:bg-[#f5ebe2]'}`}
                        >{p}</button>
                    ))}
                </div>
            </div>
            
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="salesGrad" x1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c79261" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#c79261" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e1" />
                        <XAxis 
                            dataKey="label" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6b615a', fontSize: 10, fontWeight: 700}} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6b615a', fontSize: 10, fontWeight: 700}} 
                            tickFormatter={(v) => `₹${v}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', background: '#2c2a29', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#c79261', fontWeight: 900 }}
                        />
                        <Area 
                            type="step" 
                            dataKey="revenue" 
                            stroke="#c79261" 
                            strokeWidth={4} 
                            fill="url(#salesGrad)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency distribution */}
          <div className="bg-[#2c2a29] p-8 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-[#c79261]/20">
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#c79261]/10 rounded-full blur-3xl"></div>
             
             <div>
                <h3 className="text-sm font-black uppercase text-[#c79261] tracking-widest mb-2">Market Efficiency</h3>
                <p className="text-3xl font-black">Platform Health</p>
                <p className="text-gray-400 mt-2 text-xs leading-relaxed">Systematic analysis of order success rate and capital rotation.</p>
             </div>

             <div className="space-y-6 relative z-10 my-8">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Success Rate</span>
                    <span className="text-xl font-black">98.4%</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Capital Churn</span>
                    <span className="text-xl font-black">FAST</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Orders Count</span>
                    <span className="text-xl font-black text-[#c79261]">{salesStats?.count}</span>
                </div>
             </div>

             <Button className="w-full bg-[#c79261] hover:bg-[#b58150] text-white rounded-xl h-12 font-bold uppercase text-xs tracking-widest">
                Export System Ledger
             </Button>
          </div>
      </div>

      {/* Audit Modal */}
      {isReportModalOpen && userReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-[#2c2a29]/80 backdrop-blur-md print:static print:bg-white print:p-0">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col print:max-h-none print:shadow-none print:rounded-none">
                <div className="px-8 py-6 border-b border-[#f0e9e1] flex items-center justify-between bg-[#fdfbf9] print:bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#c79261] flex items-center justify-center text-white shadow-lg shadow-[#c79261]/30 print:hidden">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#2c2a29] uppercase tracking-tighter">Purchase Audit</h2>
                            <p className="text-xs text-[#6b615a]">Transaction history for <strong className="text-[#c79261]">{users.find(u => u._id === selectedUserId)?.name}</strong></p>
                            {(fromDate || toDate) && <p className="text-[10px] text-[#2c2a29] font-bold mt-1 uppercase">Period: {fromDate || 'Infinity'} to {toDate || 'Present'}</p>}
                        </div>
                    </div>
                    <button onClick={() => setIsReportModalOpen(false)} className="bg-[#f0e9e1] p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer print:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 bg-[#fcfaf8] print:bg-white print:overflow-visible">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
                        <div className="bg-white p-5 rounded-2xl border border-[#f0e9e1] print:shadow-none">
                            <p className="text-[10px] font-black uppercase text-[#6b615a] mb-1">Lifetime Buy</p>
                            <p className="text-2xl font-black text-[#2c2a29]">₹{userReport.summary.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-[#f0e9e1] print:shadow-none">
                            <p className="text-[10px] font-black uppercase text-[#6b615a] mb-1">Order Volume</p>
                            <p className="text-2xl font-black text-[#2c2a29]">{userReport.summary.totalOrders} Invoices</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-[#f0e9e1] print:shadow-none">
                            <p className="text-[10px] font-black uppercase text-[#6b615a] mb-1">Audit Status</p>
                            <p className="text-2xl font-black text-emerald-600">VERIFIED</p>
                        </div>
                    </div>

                    <h3 className="text-xs font-black uppercase text-[#6b615a] mb-4 tracking-widest pl-2">Transactional Ledger</h3>
                    <div className="space-y-4">
                        {userReport.orders.length === 0 ? (
                            <div className="text-center py-12 text-[#6b615a] bg-white rounded-2xl border border-dashed border-[#f0e9e1]">
                                No transactions found for this period.
                            </div>
                        ) : (
                            userReport.orders.map(order => (
                                <div key={order._id} className="bg-white p-4 rounded-2xl border border-[#f0e9e1] flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-[#c79261]/30 transition-all print:break-inside-avoid">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-[#2c2a29]">INV#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className="bg-[#f0e9e1] px-2 py-0.5 rounded text-[10px] font-bold uppercase text-[#2c2a29]">
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-[#6b615a] font-medium">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Products • {order.paymentMethod}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-[#6b615a] uppercase">Amount Paid</p>
                                            <p className="text-lg font-black text-[#2c2a29]">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="print:hidden">
                                          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full bg-[#fdfbf9] border border-[#f0e9e1] hover:bg-[#c79261] hover:text-white transition-all cursor-pointer">
                                              <Download className="w-4 h-4" />
                                          </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-[#f0e9e1] flex justify-between items-center bg-[#fdfbf9] print:hidden">
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            className="rounded-xl px-6 border-[#f0e9e1] hover:bg-black hover:text-white cursor-pointer"
                            onClick={handlePrint}
                        >
                            <Printer className="w-4 h-4 mr-2" /> Print Full Ledger
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-xl px-6 border-[#f0e9e1] hover:bg-black hover:text-white cursor-pointer"
                            onClick={handleDownloadCSV}
                        >
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                    </div>
                    <Button onClick={() => setIsReportModalOpen(false)} className="bg-[#2c2a29] text-white hover:bg-[#000] rounded-xl px-8 h-11 font-bold uppercase text-xs cursor-pointer">
                        Dismiss Audit
                    </Button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
