import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { orderAPI } from '@/api/orderApi';
import { toast } from 'sonner';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.data.orders);
      } catch (err) {
        toast.error('Failed to retrieve orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-amber-100 text-amber-700';
      case 'Delivered': return 'bg-[#dcfce7] text-[#059669]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#2c2a29]">Order History</h1>
        <p className="text-sm text-[#6b615a]">View and track all your wholesale purchase orders.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#f0e9e1] shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#c79261] mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-[#2c2a29]">Loading orders...</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#f0e9e1] shadow-sm">
          <Package className="w-12 h-12 text-[#f0e9e1] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#2c2a29] mb-2">No previous orders</h3>
          <p className="text-[#6b615a] text-sm mb-6 max-w-sm mx-auto">
            You haven't placed any bulk B2B orders yet. When you do, they will appear here.
          </p>
          <Link to="/dashboard/products">
            <Button className="bg-[#c79261] hover:bg-[#b58150] cursor-pointer">
              Browse Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#f0e9e1] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#6b615a] uppercase bg-[#fdfbf9] border-b border-[#f0e9e1]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Total Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e9e1]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#fcfaf8] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#2c2a29] uppercase">
                      ...{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-[#6b615a]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-[#6b615a]">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#2c2a29]">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/dashboard/orders/${order._id}/invoice`}>
                        <Button variant="outline" size="sm" className="border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] hover:text-[#c79261] h-8 cursor-pointer">
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Invoice
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-[#6b615a] hover:bg-[#f5ebe2] h-8 px-2 cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
