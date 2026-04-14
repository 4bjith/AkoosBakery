import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Eye, Edit, Clock, CheckCircle, XCircle, Truck, X } from 'lucide-react';
import { staffAPI } from '@/api/staffApi';
import { toast } from 'sonner';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getOrders();
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await staffAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus} 📦`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c79261]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29]">Order Management</h1>
          <p className="text-[#6b615a] mt-1">Manage and track customer orders</p>
        </div>
        <button
          onClick={() => window.location.href = '/staff/orders/place'}
          className="flex items-center gap-2 px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Place Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#f0e9e1]">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders by customer, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
        >
          <option value="">All Status</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-[#f0e9e1] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1]">
            <tr>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Order ID</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Customer</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Items</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Total</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Status</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Date</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b border-[#f0e9e1] hover:bg-[#fdfbf9]">
                <td className="p-4">
                  <span className="font-mono text-sm text-[#2c2a29]">#{order._id.slice(-8)}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-[#2c2a29]">{order.user?.name}</p>
                    <p className="text-sm text-[#6b615a]">{order.user?.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-[#6b615a]">{order.items?.length || 0} items</span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-[#2c2a29]">Rs. {order.totalAmount?.toLocaleString()}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-[#6b615a]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="p-2 text-[#6b615a] hover:bg-[#f5ebe2] rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {order.status === 'Processing' && (
                      <select
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-[#f0e9e1] rounded focus:outline-none focus:ring-1 focus:ring-[#c79261]"
                      >
                        <option value="">Update</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c2a29]">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-[#f5ebe2] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6b615a]">Order ID</p>
                  <p className="font-medium text-[#2c2a29]">#{selectedOrder._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6b615a]">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#6b615a]">Order Date</p>
                  <p className="font-medium text-[#2c2a29]">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6b615a]">Total Amount</p>
                  <p className="font-medium text-[#2c2a29]">Rs. {selectedOrder.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3">Customer Information</h3>
                <div className="bg-[#fdfbf9] p-4 rounded-lg">
                  <p className="font-medium text-[#2c2a29]">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-[#6b615a]">{selectedOrder.user?.email}</p>
                  {selectedOrder.user?.phone && (
                    <p className="text-sm text-[#6b615a]">{selectedOrder.user?.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#fdfbf9] rounded-lg">
                      <div>
                        <p className="font-medium text-[#2c2a29]">{item.product?.name}</p>
                        <p className="text-sm text-[#6b615a]">{item.product?.category?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#2c2a29]">Rs. {item.price?.toLocaleString()}</p>
                        <p className="text-sm text-[#6b615a]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div>
                  <h3 className="font-semibold text-[#2c2a29] mb-3">Delivery Address</h3>
                  <div className="bg-[#fdfbf9] p-4 rounded-lg">
                    <p className="text-[#2c2a29]">{selectedOrder.deliveryAddress.street}</p>
                    {selectedOrder.deliveryAddress.city && <p className="text-[#2c2a29]">{selectedOrder.deliveryAddress.city}</p>}
                    {(selectedOrder.deliveryAddress.state || selectedOrder.deliveryAddress.pincode) && (
                      <p className="text-[#2c2a29]">
                        {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.pincode}
                      </p>
                    )}
                    <p className="text-[#2c2a29]">{selectedOrder.deliveryAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Staff Notes */}
              {selectedOrder.staffNotes && (
                <div>
                  <h3 className="font-semibold text-[#2c2a29] mb-3">Staff Notes</h3>
                  <div className="bg-[#fdfbf9] p-4 rounded-lg">
                    <p className="text-[#2c2a29]">{selectedOrder.staffNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
