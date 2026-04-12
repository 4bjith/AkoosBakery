import { useState, useEffect } from 'react';
import { PackageOpen, Clock, Truck, CheckCircle, RefreshCw, X, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI } from '@/api/orderApi';
import { Button } from '@/components/ui/button';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data.data.orders);
    } catch (err) {
      toast.error('Failed to load system orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await orderAPI.updateStatus(id, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-amber-100 text-amber-700';
      case 'Delivered': return 'bg-[#dcfce7] text-[#059669]';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Quick stats calculations
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const currMonthTotal = orders.filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
                               .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#f0e9e1]">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29] flex items-center gap-2 border-none">
            <div className="p-1.5 bg-[#c79261]/10 rounded-lg">
              <PackageOpen className="w-6 h-6 text-[#c79261]" />
            </div>
            Orders Management
          </h1>
          <p className="text-sm text-[#6b615a] mt-1 ml-11">Review B2B invoices and update shipping timelines.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">Pending Processing</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{processingCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Truck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">In Transit</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{shippedCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-[#c79261]/10 rounded-xl">
            <FileText className="w-6 h-6 text-[#c79261]" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">Month Sales</p>
            <p className="text-2xl font-bold text-[#2c2a29]">₹{currMonthTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1] text-[#6b615a] uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6b615a]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#c79261]" />
                    Loading system orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6b615a]">
                    No B2B orders have been placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-[#fcfaf8] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2c2a29] uppercase">
                       ...{o._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-[#6b615a]">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#2c2a29]">{o.user?.companyName || 'Unknown Auth'}</div>
                      <div className="text-[10px] text-[#6b615a]">{o.user?.name}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#2c2a29]">₹{o.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        className={`text-xs font-bold uppercase tracking-wider rounded-md border border-[#f0e9e1] px-2 py-1 outline-none focus:ring-2 focus:ring-[#c79261]/30 cursor-pointer ${getStatusColor(o.status)}`}
                        value={o.status}
                        onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                        disabled={updatingId === o._id}
                      >
                        <option value="Processing" className="bg-white text-gray-900">Processing</option>
                        <option value="Shipped" className="bg-white text-gray-900">Shipped</option>
                        <option value="Delivered" className="bg-white text-gray-900">Delivered</option>
                        <option value="Cancelled" className="bg-white text-gray-900">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <Button onClick={() => openOrderDetails(o)} variant="outline" size="sm" className="h-8 border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] hover:text-[#c79261]">
                         <FileText className="w-3.5 h-3.5 mr-1" />
                         Evaluate
                       </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Details Extractor */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2a29]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#f0e9e1] flex items-center justify-between bg-[#fdfbf9]">
              <h2 className="text-xl font-bold text-[#2c2a29]">
                Invoice Breakdown ...<span className="text-[#c79261] uppercase">{selectedOrder._id.slice(-6)}</span>
              </h2>
              <button onClick={closeModal} className="text-[#6b615a] hover:text-[#2c2a29] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                     <p className="text-[#6b615a]">Buyer Profile</p>
                     <p className="font-semibold text-[#2c2a29]">{selectedOrder.user?.companyName}</p>
                     <p className="text-[#2c2a29]">{selectedOrder.user?.name}</p>
                     <p className="text-[#2c2a29]">{selectedOrder.user?.email}</p>
                     <p className="text-[#2c2a29]">{selectedOrder.user?.phone}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[#6b615a]">Operational Timeline</p>
                     <p className="font-semibold text-[#2c2a29]">
                       Ordered: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                     </p>
                     <p className="font-semibold text-[#2c2a29]">
                       Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                     </p>
                  </div>
               </div>

               <div>
                 <h3 className="font-semibold text-[#2c2a29] mb-3 border-b border-[#f0e9e1] pb-2">Line Items</h3>
                 <div className="space-y-3">
                   {selectedOrder.items.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center text-sm border border-[#f0e9e1] p-3 rounded-lg">
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-[#f5ebe2] rounded overflow-hidden">
                           {item.product?.images?.[0] ? (
                             <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-[#f0e9e1]" />
                           )}
                         </div>
                         <div>
                           <p className="font-medium text-[#2c2a29]">{item.product?.name || 'Deleted Product'}</p>
                           <p className="text-xs text-[#6b615a]">{item.quantity} units @ ₹{item.price}/ea</p>
                         </div>
                       </div>
                       <p className="font-bold text-[#c79261]">₹{(item.quantity * item.price).toLocaleString()}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex justify-end pt-4 border-t border-[#f0e9e1]">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between text-[#6b615a]">
                      <p>Subtotal</p>
                      <p>₹{(selectedOrder.totalAmount - selectedOrder.taxAmount).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-[#6b615a]">
                      <p>Tax Amount</p>
                      <p>₹{selectedOrder.taxAmount?.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[#2c2a29] pt-2 border-t border-dashed border-[#f0e9e1]">
                      <p>Gross Pay</p>
                      <p>₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="px-6 py-4 border-t border-[#f0e9e1] flex justify-between items-center bg-[#fdfbf9]">
              <span className={`px-3 py-1 font-semibold rounded-md ${getStatusColor(selectedOrder.status)}`}>
                 Currently: {selectedOrder.status}
              </span>
              <Button type="button" onClick={closeModal} className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-md cursor-pointer">
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
