import { Activity, Package, Users, DollarSign } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AdminOverview() {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Revenue', value: '₹1,24,500', icon: DollarSign, color: 'text-green-600', bg: 'bg-[#dcfce7]' },
    { name: 'Active Products', value: '24', icon: Package, color: 'text-[#c79261]', bg: 'bg-[#c79261]/10' },
    { name: 'Total Users', value: '1,429', icon: Users, color: 'text-[#2c2a29]', bg: 'bg-[#f0e9e1]' },
    { name: 'Pending Orders', value: '12', icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c2a29] border-none p-0 inline-block">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-[#6b615a] mt-1">Here's what's happening in your business today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-[#2c2a29]">{stat.value}</h3>
              <p className="text-sm font-medium text-[#6b615a] uppercase tracking-wider">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#6b615a]">Sales Chart Placeholder</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-[#6b615a]">Recent Activity Logs</p>
        </div>
      </div>
    </div>
  );
}
