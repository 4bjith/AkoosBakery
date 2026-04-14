import { useState, useEffect } from 'react';
import { FileText, Search, Edit, Download, Eye, Filter, DollarSign, Percent, Truck, X } from 'lucide-react';
import { staffAPI } from '@/api/staffApi';
import { toast } from 'sonner';

export default function InvoiceManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    items: [],
    discountApplied: { amount: 0, reason: '' },
    deliveryAddress: {},
    taxAmount: 0,
    shippingAmount: 0,
  });

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
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = async (e) => {
    e.preventDefault();
    try {
      await staffAPI.updateInvoice(selectedOrder._id, editFormData);
      toast.success('Invoice updated successfully! 📝');
      setShowEditModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditFormData({
      items: order.items || [],
      discountApplied: order.discountApplied || { amount: 0, reason: '' },
      deliveryAddress: order.deliveryAddress || {},
      taxAmount: order.taxAmount || 0,
      shippingAmount: order.shippingAmount || 0,
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const updateItemQuantity = (index, quantity) => {
    const newItems = [...editFormData.items];
    newItems[index].quantity = parseInt(quantity) || 1;
    setEditFormData({ ...editFormData, items: newItems });
  };

  const updateItemPrice = (index, price) => {
    const newItems = [...editFormData.items];
    newItems[index].price = parseFloat(price) || 0;
    setEditFormData({ ...editFormData, items: newItems });
  };

  const updateDiscount = (amount, reason) => {
    setEditFormData({
      ...editFormData,
      discountApplied: { amount: parseFloat(amount) || 0, reason }
    });
  };

  const calculateTotal = () => {
    const itemsTotal = editFormData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    return itemsTotal + editFormData.taxAmount + editFormData.shippingAmount - editFormData.discountApplied.amount;
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
          <h1 className="text-2xl font-bold text-[#2c2a29]">Invoice Management</h1>
          <p className="text-[#6b615a] mt-1">Edit and manage customer invoices</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#f0e9e1]">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoices by customer, email, or order ID..."
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
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-[#f0e9e1] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1]">
            <tr>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Invoice #</th>
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
                  <span className="font-mono text-sm text-[#2c2a29]">INV-{order._id.slice(-8)}</span>
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
                  <div className="space-y-1">
                    <span className="font-medium text-[#2c2a29]">Rs. {order.totalAmount?.toLocaleString()}</span>
                    {order.discountApplied?.amount > 0 && (
                      <div className="text-xs text-green-600">
                        Discount: Rs. {order.discountApplied.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-[#6b615a]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDetailsModal(order)}
                      className="p-2 text-[#6b615a] hover:bg-[#f5ebe2] rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(order)}
                      className="p-2 text-[#6b615a] hover:bg-[#f5ebe2] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* TODO: Implement PDF download */}}
                      className="p-2 text-[#6b615a] hover:bg-[#f5ebe2] rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Invoice Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c2a29]">Edit Invoice</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#f5ebe2] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditInvoice} className="space-y-6">
              {/* Items Section */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {editFormData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-[#fdfbf9] rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-[#2c2a29]">{item.product?.name}</p>
                        <p className="text-sm text-[#6b615a]">{item.product?.category?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-[#6b615a]">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, e.target.value)}
                          className="w-20 px-2 py-1 border border-[#f0e9e1] rounded focus:outline-none focus:ring-1 focus:ring-[#c79261]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-[#6b615a]">Price:</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItemPrice(index, e.target.value)}
                          className="w-24 px-2 py-1 border border-[#f0e9e1] rounded focus:outline-none focus:ring-1 focus:ring-[#c79261]"
                        />
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#2c2a29]">
                          Rs. {(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Section */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Discount
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Discount Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.discountApplied.amount}
                      onChange={(e) => updateDiscount(e.target.value, editFormData.discountApplied.reason)}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Reason</label>
                    <input
                      type="text"
                      value={editFormData.discountApplied.reason}
                      onChange={(e) => updateDiscount(editFormData.discountApplied.amount, e.target.value)}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Charges */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Additional Charges
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Tax Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.taxAmount}
                      onChange={(e) => setEditFormData({ ...editFormData, taxAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Shipping Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.shippingAmount}
                      onChange={(e) => setEditFormData({ ...editFormData, shippingAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold text-[#2c2a29] mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Delivery Address
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Street Address</label>
                    <input
                      type="text"
                      value={editFormData.deliveryAddress.street || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        deliveryAddress: { ...editFormData.deliveryAddress, street: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">City</label>
                    <input
                      type="text"
                      value={editFormData.deliveryAddress.city || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        deliveryAddress: { ...editFormData.deliveryAddress, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">State</label>
                    <input
                      type="text"
                      value={editFormData.deliveryAddress.state || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        deliveryAddress: { ...editFormData.deliveryAddress, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2c2a29] mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editFormData.deliveryAddress.pincode || ''}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        deliveryAddress: { ...editFormData.deliveryAddress, pincode: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    />
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-[#fdfbf9] p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6b615a]">Items Total:</span>
                    <span className="font-medium text-[#2c2a29]">
                      Rs. {editFormData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b615a]">Tax:</span>
                    <span className="font-medium text-[#2c2a29]">Rs. {editFormData.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b615a]">Shipping:</span>
                    <span className="font-medium text-[#2c2a29]">Rs. {editFormData.shippingAmount.toLocaleString()}</span>
                  </div>
                  {editFormData.discountApplied.amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-Rs. {editFormData.discountApplied.amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-[#2c2a29]">Total:</span>
                    <span className="font-bold text-[#c79261] text-lg">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-[#f0e9e1] rounded-lg hover:bg-[#f5ebe2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
                >
                  Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c2a29]">Invoice Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-[#f5ebe2] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#2c2a29]">Akoos Bakery</h3>
                  <p className="text-sm text-[#6b615a]">Invoice #: INV-{selectedOrder._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#6b615a]">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-[#6b615a]">Status: {selectedOrder.status}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-[#2c2a29] mb-2">Bill To:</h4>
                <div className="bg-[#fdfbf9] p-3 rounded-lg">
                  <p className="font-medium text-[#2c2a29]">{selectedOrder.user?.name}</p>
                  <p className="text-sm text-[#6b615a]">{selectedOrder.user?.email}</p>
                  {selectedOrder.deliveryAddress && (
                    <div className="mt-2 text-sm text-[#2c2a29]">
                      <p>{selectedOrder.deliveryAddress.street}</p>
                      <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.pincode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-[#2c2a29] mb-2">Items:</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-[#fdfbf9] rounded">
                      <div>
                        <p className="font-medium text-[#2c2a29]">{item.product?.name}</p>
                        <p className="text-sm text-[#6b615a]">Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                      </div>
                      <p className="font-medium text-[#2c2a29]">Rs. {(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6b615a]">Subtotal:</span>
                    <span className="font-medium text-[#2c2a29]">
                      Rs. {selectedOrder.items?.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6b615a]">Tax:</span>
                      <span className="font-medium text-[#2c2a29]">Rs. {selectedOrder.taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedOrder.shippingAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#6b615a]">Shipping:</span>
                      <span className="font-medium text-[#2c2a29]">Rs. {selectedOrder.shippingAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedOrder.discountApplied?.amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-Rs. {selectedOrder.discountApplied.amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#2c2a29]">Total:</span>
                    <span className="text-[#c79261]">Rs. {selectedOrder.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Edit History */}
              {selectedOrder.invoiceEdits && selectedOrder.invoiceEdits.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#2c2a29] mb-2">Edit History:</h4>
                  <div className="space-y-2">
                    {selectedOrder.invoiceEdits.map((edit, index) => (
                      <div key={index} className="text-sm bg-[#fdfbf9] p-2 rounded">
                        <p className="text-[#6b615a]">
                          Edited by {edit.editedBy?.name} on {new Date(edit.editedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-1">
                          {edit.changes?.map((change, changeIndex) => (
                            <span key={changeIndex} className="text-xs text-[#6b615a]">
                              {change.field}: {change.oldValue} {'->'} {change.newValue}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
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
