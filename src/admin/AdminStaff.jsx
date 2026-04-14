import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Filter, ShieldCheck, X } from 'lucide-react';
import { adminAPI } from '@/api/adminApi';
import { toast } from 'sonner';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    permissions: {
      canManageCustomers: true,
      canCreateCustomers: true,
      canEditCustomers: true,
      canManageAddresses: true,
      canViewPricing: true,
      canEditInvoices: true,
      canUpdateOrderStatus: true,
      canViewAllCustomers: true,
      canPlaceOrders: true,
      canApplyDiscounts: true,
    },
    assignedRegions: [],
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllStaff();
      setStaff(response.data.data.staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createStaff(formData);
      toast.success('Staff member created successfully! 👤');
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        permissions: {
          canManageCustomers: true,
          canCreateCustomers: true,
          canEditCustomers: true,
          canManageAddresses: true,
          canViewPricing: true,
          canEditInvoices: true,
          canUpdateOrderStatus: true,
          canViewAllCustomers: true,
          canPlaceOrders: true,
          canApplyDiscounts: true,
        },
        assignedRegions: [],
      });
      fetchStaff();
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff member');
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStaff(selectedStaff._id, formData);
      toast.success('Staff member updated successfully! ✏️');
      setShowEditModal(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Failed to update staff member');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await adminAPI.deleteStaff(staffId);
        toast.success('Staff member deactivated');
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to deactivate staff member');
      }
    }
  };

  const openEditModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      permissions: staffMember.permissions,
      assignedRegions: staffMember.assignedRegions || [],
    });
    setShowEditModal(true);
  };

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.staffId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissionLabels = {
    canManageCustomers: 'Manage Customers',
    canCreateCustomers: 'Create Customers',
    canEditCustomers: 'Edit Customers',
    canManageAddresses: 'Manage Addresses',
    canViewPricing: 'View Pricing',
    canEditInvoices: 'Edit Invoices',
    canUpdateOrderStatus: 'Update Order Status',
    canViewAllCustomers: 'View All Customers',
    canPlaceOrders: 'Place Orders',
    canApplyDiscounts: 'Apply Discounts',
  };

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
          <h1 className="text-2xl font-bold text-[#2c2a29]">Staff Management</h1>
          <p className="text-[#6b615a] mt-1">Manage staff members and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-[#f0e9e1]">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, email, or staff ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#f0e9e1] rounded-lg hover:bg-[#f5ebe2] transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg border border-[#f0e9e1] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1]">
            <tr>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Staff Member</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Staff ID</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Contact</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Status</th>
              <th className="text-left p-4 font-medium text-[#2c2a29]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staffMember) => (
              <tr key={staffMember._id} className="border-b border-[#f0e9e1] hover:bg-[#fdfbf9]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#c79261] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {staffMember.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#2c2a29]">{staffMember.name}</p>
                      <p className="text-sm text-[#6b615a]">Staff</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-[#c79261]/10 text-[#c79261] rounded-lg text-sm font-medium">
                    {staffMember.staffId || 'N/A'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-[#2c2a29]">{staffMember.email}</p>
                    <p className="text-sm text-[#6b615a]">{staffMember.phone || 'N/A'}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                    staffMember.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {staffMember.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(staffMember)}
                      className="p-2 text-[#6b615a] hover:bg-[#f5ebe2] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staffMember._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c2a29]">Create New Staff Member</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-[#f5ebe2] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c2a29] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c2a29] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions[key]}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-[#c79261] border-[#f0e9e1] rounded focus:ring-[#c79261]"
                      />
                      <span className="text-sm text-[#2c2a29]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
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
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c2a29]">Edit Staff Member</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#f5ebe2] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions[key]}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-[#c79261] border-[#f0e9e1] rounded focus:ring-[#c79261]"
                      />
                      <span className="text-sm text-[#2c2a29]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
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
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
