import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Shield, 
  RefreshCw, X, Edit2, Trash2, 
  Search, Filter, ChevronRight, Mail, Phone, Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '@/api/userApi';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAllUsers();
      setUsers(data.data.users);
    } catch (err) {
      toast.error('Failed to load ecosystem users');
    } finally {
      setLoading(false);
    }
  };

  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    if (user._id === currentUser?._id) {
        toast.error("You cannot deactivate your own administrative account.");
        return;
    }
    try {
      const newStatus = !user.isActive;
      await userAPI.updateUser(user._id, { isActive: newStatus });
      toast.success(`User ${user.name} has been ${newStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer',
      isActive: user.isActive,
      permissions: {
        canManageCustomers: user.permissions?.canManageCustomers ?? true,
        canCreateCustomers: user.permissions?.canCreateCustomers ?? true,
        canEditCustomers: user.permissions?.canEditCustomers ?? true,
        canManageAddresses: user.permissions?.canManageAddresses ?? true,
        canViewPricing: user.permissions?.canViewPricing ?? true,
        canEditInvoices: user.permissions?.canEditInvoices ?? true,
        canUpdateOrderStatus: user.permissions?.canUpdateOrderStatus ?? true,
        canViewAllCustomers: user.permissions?.canViewAllCustomers ?? true,
        canPlaceOrders: user.permissions?.canPlaceOrders ?? true,
        canApplyDiscounts: user.permissions?.canApplyDiscounts ?? true,
      }
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateUser(selectedUser._id, editForm);
      toast.success('Account details updated successfully');
      fetchUsers();
      closeEditModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (user._id === currentUser?._id) {
        toast.error("Critical Safety Alert: Cannot delete current session user.");
        return;
    }
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${user.name}? This action cannot be undone.`)) return;
    
    try {
      await userAPI.deleteUser(user._id);
      toast.success('Account purged from ecosystem');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    
    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  // Metrics
  const activeCount = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#f0e9e1]">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29] flex items-center gap-2">
            <div className="p-1.5 bg-[#c79261]/10 rounded-lg">
              <Users className="w-6 h-6 text-[#c79261]" />
            </div>
            User Ecosystem
          </h1>
          <p className="text-sm text-[#6b615a] mt-1 ml-11">Monitor account health, manage permissions and moderate users.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6b615a]" />
                <input 
                    type="text" 
                    placeholder="Search name, email..." 
                    className="pl-9 pr-4 py-2 text-sm bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl outline-none focus:ring-2 focus:ring-[#c79261]/20 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-3 py-2 text-sm outline-none cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
            >
                <option value="All">All Roles</option>
                <option value="Admin">Admins</option>
                <option value="Staff">Staff</option>
                <option value="Customer">Customers</option>
            </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">Active Accounts</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <UserX className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">Inactive/Paused</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{users.length - activeCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">System Admins</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{adminCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">Staff Members</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{staffCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#f0e9e1] flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-[#6b615a] font-medium">B2B Customers</p>
            <p className="text-2xl font-bold text-[#2c2a29]">{customerCount}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1] text-[#6b615a] uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Full Identity</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Portal Access</th>
                <th className="px-6 py-4">Account Health</th>
                <th className="px-6 py-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#6b615a]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#c79261]" />
                    Synchronizing ecosystem registry...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#6b615a]">
                    No accounts found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[#fcfaf8] transition-colors group">
                    <td className="px-6 py-4 border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c79261]/10 flex items-center justify-center font-bold text-[#c79261] uppercase border border-[#c79261]/20">
                            {u.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-[#2c2a29]">{u.name}</div>
                            <div className="text-[10px] text-[#6b615a] flex items-center gap-1 uppercase tracking-tighter">
                                <Calendar className="w-3 h-3"/> Joined: {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-none">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-medium text-[#2c2a29]"><Mail className="w-3 h-3 text-[#c79261]" /> {u.email}</div>
                          {u.phone && <div className="flex items-center gap-2 text-xs font-medium text-[#2c2a29]"><Phone className="w-3 h-3 text-[#c79261]" /> {u.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-none">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 
                        u.role === 'staff' ? 'bg-purple-100 text-purple-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-none">
                        <button 
                            onClick={() => handleToggleStatus(u)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                u.isActive 
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-500 hover:bg-red-100'
                            }`}
                        >
                            {u.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            {u.isActive ? 'Active' : 'Paused'}
                        </button>
                    </td>
                    <td className="px-6 py-4 border-none text-right">
                       <div className="flex justify-end gap-2">
                          <Button onClick={() => openEditModal(u)} variant="outline" size="sm" className="h-8 w-8 p-0 border-[#f0e9e1] cursor-pointer">
                             <Edit2 className="w-3.5 h-3.5 text-[#2c2a29]" />
                          </Button>
                          <Button onClick={() => handleDeleteUser(u)} variant="outline" size="sm" className="h-8 w-8 p-0 border-[#f0e9e1] hover:bg-red-50 hover:text-red-500 cursor-pointer">
                             <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2a29]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#f0e9e1] flex items-center justify-between bg-[#fdfbf9]">
              <h2 className="text-xl font-bold text-[#2c2a29]">Moderate Identity</h2>
              <button onClick={closeEditModal} className="text-[#6b615a] hover:text-[#2c2a29] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6b615a] uppercase">Legal Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79261]/20"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6b615a] uppercase">Registry Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79261]/20"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6b615a] uppercase">Phone Line</label>
                <input 
                  type="text" 
                  className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#c79261]/20"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6b615a] uppercase">System Role</label>
                    <select 
                        className="w-full bg-[#fdfbf9] border border-[#f0e9e1] rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                        value={editForm.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setEditForm({...editForm, role: newRole});
                        }}
                    >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#6b615a] uppercase">Account Status</label>
                    <div className="flex items-center gap-2 h-[46px]">
                        <button 
                            type="button"
                            onClick={() => setEditForm({...editForm, isActive: !editForm.isActive})}
                            className={`flex-1 h-full rounded-xl font-bold text-xs transition-all ${
                                editForm.isActive 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : 'bg-red-50 text-red-500 border border-red-100'
                            }`}
                        >
                            {editForm.isActive ? 'Active Mode' : 'Suspended Mode'}
                        </button>
                    </div>
                </div>
              </div>

              {/* Staff Permissions Section */}
              {editForm.role === 'staff' && (
                <div className="space-y-3 pt-2 border-t border-[#f0e9e1]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#6b615a] uppercase">Staff Permissions</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditForm({
                          ...editForm,
                          permissions: Object.keys(editForm.permissions).reduce((acc, key) => ({...acc, [key]: true}), {})
                        })}
                        className="text-[10px] px-2 py-1 bg-[#c79261]/10 text-[#c79261] rounded hover:bg-[#c79261]/20 transition-colors"
                      >
                        Enable All
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({
                          ...editForm,
                          permissions: Object.keys(editForm.permissions).reduce((acc, key) => ({...acc, [key]: false}), {})
                        })}
                        className="text-[10px] px-2 py-1 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {[
                      { key: 'canManageCustomers', label: 'Manage Customers' },
                      { key: 'canCreateCustomers', label: 'Create Customers' },
                      { key: 'canEditCustomers', label: 'Edit Customers' },
                      { key: 'canManageAddresses', label: 'Manage Addresses' },
                      { key: 'canViewPricing', label: 'View Pricing' },
                      { key: 'canEditInvoices', label: 'Edit Invoices' },
                      { key: 'canUpdateOrderStatus', label: 'Update Order Status' },
                      { key: 'canViewAllCustomers', label: 'View All Customers' },
                      { key: 'canPlaceOrders', label: 'Place Orders' },
                      { key: 'canApplyDiscounts', label: 'Apply Discounts' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-[#fdfbf9] rounded-lg cursor-pointer hover:bg-[#f5f0eb] transition-colors">
                        <input
                          type="checkbox"
                          checked={editForm.permissions[key]}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            permissions: { ...editForm.permissions, [key]: e.target.checked }
                          })}
                          className="w-4 h-4 accent-[#c79261] cursor-pointer"
                        />
                        <span className="text-xs text-[#2c2a29]">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={closeEditModal} 
                    className="flex-1 rounded-xl h-11 border-[#f0e9e1] cursor-pointer"
                >
                    Discard Changes
                </Button>
                <Button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 rounded-xl h-11 bg-[#c79261] hover:bg-[#b58150] text-white shadow-lg shadow-[#c79261]/25 cursor-pointer"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Apply Updates'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
