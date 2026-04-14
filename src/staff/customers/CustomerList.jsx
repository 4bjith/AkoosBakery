import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { staffAPI } from '@/api/staffApi';
import { toast } from 'sonner';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: [],
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getCustomers();
      setCustomers(response.data.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await staffAPI.createCustomer(formData);
      const createdCustomer = response.data.data.customer;
      
      // Generate random password for new customer
      const generatedPassword = generateRandomPassword();
      
      // Show success message with credentials
      toast.success(`Customer created! Email: ${createdCustomer.email}, Password: ${generatedPassword} 👤`);
      
      setShowCreateModal(false);
      setFormData({ name: '', email: '', phone: '', addresses: [] });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await staffAPI.updateCustomer(selectedCustomer._id, formData);
      toast.success('Customer updated successfully! ✏️');
      setShowEditModal(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to deactivate this customer?')) {
      try {
        await staffAPI.deleteCustomer(customerId);
        toast.success('Customer deactivated');
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Failed to deactivate customer');
      }
    }
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      addresses: customer.addresses || [],
    });
    setShowEditModal(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold text-[#2c2a29]">Customer Management</h1>
          <p className="text-[#6b615a] mt-1">Manage customer accounts and information</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-[#f0e9e1]">
        <div className="relative">
          <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer._id} className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#c79261] rounded-full flex items-center justify-center text-white font-bold">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#2c2a29]">{customer.name}</h3>
                  <p className="text-sm text-[#6b615a]">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${customer.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs text-[#6b615a]">
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#6b615a]">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-[#6b615a]">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.addresses && customer.addresses.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-[#6b615a]">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.addresses.length} address(es)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(customer)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#c79261]/10 text-[#c79261] rounded-lg hover:bg-[#c79261]/20 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2c2a29] mb-4">Create New Customer</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#f0e9e1] rounded-lg hover:bg-[#f5ebe2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2c2a29] mb-4">Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
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
                  Update Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
